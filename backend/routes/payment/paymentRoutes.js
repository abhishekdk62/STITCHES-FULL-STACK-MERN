const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Transaction = require("../../models/transactionSchema");
const authMiddleware = require("../../middlewares/verifyToken");

dotenv.config();

const router = express.Router();

const PAYPAL_API = process.env.PAYPAL_API;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const isAllowedUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const allowed = new URL(process.env.FRONTEND_URL);
    return parsed.origin === allowed.origin;
  } catch {
    return false;
  }
};

const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
      "base64"
    );
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Failed to get PayPal access token:",
      error.response?.data || error.message
    );
    throw new Error("Could not generate PayPal access token");
  }
};

const safeAmount = (value) =>
  parseFloat(Number(value || 0).toFixed(2));

router.post("/create-order", authMiddleware(["user"]), async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const {
      cid,
      cartItems,
      address,
      paymentMethod,
      totalPrice,
      tax,
      shippingPrice,
      grandTotal,
      returnUrl,
      cancelUrl,
      couponData,
      discount,
    } = req.body;

    const uid = req.user.id;

    const itemTotal = safeAmount(totalPrice);
    const taxTotal = safeAmount(tax);
    const shippingTotal = safeAmount(shippingPrice);
    const discountTotal = safeAmount(discount);
    const amountTotal = safeAmount(
      grandTotal ?? itemTotal + taxTotal + shippingTotal - discountTotal
    );

    if (amountTotal <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    const finalReturnUrl = isAllowedUrl(returnUrl)
      ? returnUrl
      : `${process.env.FRONTEND_URL}/payment/success`;
    const finalCancelUrl = isAllowedUrl(cancelUrl)
      ? cancelUrl
      : `${process.env.FRONTEND_URL}/payment/failure`;

    const orderResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amountTotal.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: itemTotal.toFixed(2),
                },
                tax_total: {
                  currency_code: "USD",
                  value: taxTotal.toFixed(2),
                },
                discount: {
                  currency_code: "USD",
                  value: discountTotal.toFixed(2),
                },
                shipping: {
                  currency_code: "USD",
                  value: shippingTotal.toFixed(2),
                },
              },
            },
          },
        ],
        application_context: {
          return_url: finalReturnUrl,
          cancel_url: finalCancelUrl,
          brand_name: "STITCHES",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = orderResponse.data.links.find(
      (link) => link.rel === "approve"
    )?.href;
    if (!approvalUrl) throw new Error("No approval URL found");

    res.json({
      approvalUrl,
      orderID: orderResponse.data.id,
      orderDetails: {
        cartItems,
        address,
        paymentMethod,
        totalPrice,
        tax,
        shippingPrice,
        grandTotal: amountTotal,
        uid,
        cid,
        couponData,
        discount,
      },
    });
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Could not create PayPal order" });
  }
});

router.post(
  "/capture-order/:orderID",
  authMiddleware(["user"]),
  async (req, res) => {
    try {
      const accessToken = await generateAccessToken();
      const { orderID } = req.params;
      const { orderDetails, couponDetails } = req.body;
      const userId = req.user.id;

      if (!orderDetails?.items?.length) {
        return res.status(400).json({ message: "Invalid order details" });
      }

      for (const item of orderDetails.items) {
        const product = await Product.findOne({ _id: item.productId });
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );
        if (!variant) {
          return res.status(404).json({ message: "Variant not found" });
        }
        if (variant.stock < item.quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
      }

      const existingOrder = await Order.findOne({ paypalOrderId: orderID });
      if (existingOrder) {
        return res.json({
          message: "Order already captured",
          order: existingOrder,
          success: true,
        });
      }

      const captureResponse = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!captureResponse.data || captureResponse.status !== 201) {
        return res.status(500).json({ message: "PayPal capture failed" });
      }

      const transactionId =
        captureResponse.data.purchase_units[0].payments.captures[0].id;
      const ordid = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const coupon = couponDetails || orderDetails.couponData || {};

      const newOrder = new Order({
        orderID: ordid,
        user: userId,
        paypalOrderId: orderID,
        items: orderDetails.items.map((item) => ({
          product: item.productId || item.product,
          variant: item.variantId || item.variant,
          quantity: item.quantity,
          price: item.price,
          status: "Pending",
        })),
        address: orderDetails.address,
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: "Paid",
        totalPrice: orderDetails.totalPrice,
        tax: orderDetails.tax,
        shippingPrice: orderDetails.shippingPrice,
        grandTotal: orderDetails.grandTotal,
        transactionId,
        coupon: {
          code: coupon?.code ?? null,
          value: coupon?.discountValue ?? null,
        },
        discount: orderDetails.discount || 0,
      });

      await newOrder.save();

      if (orderDetails.cid) {
        await Cart.findByIdAndUpdate(orderDetails.cid, {
          $set: { items: [] },
        });
      }

      for (const item of orderDetails.items) {
        await Product.updateOne(
          { _id: item.productId, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": -item.quantity } }
        );
      }

      res.json({
        message: "Payment captured and order created successfully",
        order: newOrder,
        success: true,
      });
    } catch (error) {
      console.error(
        "Error capturing order:",
        error.response?.data || error.message
      );
      res.status(500).json({ message: "Could not capture PayPal order" });
    }
  }
);

router.post("/add-money", authMiddleware(["user"]), async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const return_url = `${process.env.FRONTEND_URL}/wallet/payed?success=true`;
    const cancel_url = `${process.env.FRONTEND_URL}/wallet/error?cancel=true`;

    const orderResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url,
          cancel_url,
          brand_name: "STITCHES",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const orderID = orderResponse.data.id;

    let approvalUrl = orderResponse.data.links.find(
      (link) => link.rel === "approve"
    )?.href;
    if (!approvalUrl) throw new Error("No approval URL found");

    const separator = approvalUrl.includes("?") ? "&" : "?";
    approvalUrl = `${approvalUrl}${separator}orderID=${orderID}`;

    res.json({ approvalUrl, orderID, userId });
  } catch (error) {
    console.error(
      "Error creating wallet deposit order:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Could not create PayPal order" });
  }
});

router.post(
  "/capture-wallet-payment",
  authMiddleware(["user"]),
  async (req, res) => {
    try {
      const accessToken = await generateAccessToken();
      const { orderID } = req.body;
      const userId = req.user.id;

      if (!orderID) {
        return res.status(400).json({ message: "Missing order ID" });
      }

      const existingTx = await Transaction.findOne({
        user: userId,
        details: { $regex: orderID },
      });
      if (existingTx) {
        const user = await User.findById(userId).select("balance");
        return res.json({
          message: "Payment already captured",
          newBalance: user.balance,
          success: true,
        });
      }

      const captureResponse = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!captureResponse.data || captureResponse.status !== 201) {
        return res.status(500).json({ message: "PayPal capture failed" });
      }

      const captureData = captureResponse.data;
      const amount = parseFloat(
        captureData.purchase_units[0].payments.captures[0].amount.value
      );

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.balance += amount;
      await user.save();

      const transaction = new Transaction({
        user: userId,
        transactionType: "Credited",
        amount,
        details: `Added ${amount} USD to wallet via PayPal (${orderID}).`,
      });
      await transaction.save();

      res.json({
        message: "Payment captured and wallet updated successfully",
        transactionId:
          captureData.purchase_units[0].payments.captures[0].id,
        newBalance: user.balance,
        success: true,
      });
    } catch (error) {
      console.error(
        "Error capturing wallet deposit order:",
        error.response?.data || error.message
      );
      res.status(500).json({ message: "Could not capture wallet payment" });
    }
  }
);

module.exports = router;
