const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Transaction = require("../../models/transactionSchema");

dotenv.config();

const router = express.Router();

const PAYPAL_API = process.env.PAYPAL_API;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

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
      " Failed to get PayPal access token:",
      error.response?.data || error.message
    );
    throw new Error(
      `Could not generate PayPal access token: ${
        error.response?.data?.error_description || error.message
      }`
    );
  }
};

router.post("/create-order", async (req, res) => {
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
      uid,
      returnUrl,
      cancelUrl,
      couponData,
      discount,
    } = req.body;

    const finalReturnUrl = returnUrl || "https://stitches.digital/payment/success";
    const finalCancelUrl = cancelUrl || "https://stitches.digital/payment/failure";

    const orderResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: grandTotal.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: totalPrice.toFixed(2),
                },
                tax_total: { currency_code: "USD", value: tax.toFixed(2) },
                discount: {
                  currency_code: "USD",
                  value: discount.toFixed(2),
                },

                shipping: {
                  currency_code: "USD",
                  value: shippingPrice.toFixed(2),
                },
              },
            },
          },
        ],
        application_context: {
          return_url: finalReturnUrl,
          cancel_url: finalCancelUrl,
          brand_name: "Your Store Name",
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
        grandTotal,
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
    res
      .status(500)
      .json({ error: error.message || "Could not create PayPal order" });
  }
});

router.post("/capture-order/:orderID", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const { orderID } = req.params;
    const orderDetails = req.body;
    




    for (const item of orderDetails.items) {
      const product = await Product.findOne({ _id: item.productId });

      const variant = product.variants.find(
        (v) => v._id.toString() == item.variantId.toString()
      );
      if (variant.stock < item.quantity) {
        return res.status(400).json("Stock empty");
      }
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
      console.error(
        "❌ PayPal capture failed with status:",
        captureResponse.status
      );
      return res.status(500).json({ error: "PayPal capture failed" });
    }

    const transactionId =
      captureResponse.data.purchase_units[0].payments.captures[0].id;
      const ordid = "ORD-" + Math.random().toString().slice(2, 7);

    const newOrder = new Order({
      orderID: ordid,
      user: orderDetails.userId,
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
        code: orderDetails?.couponData?.code??null,
        value: orderDetails?.couponData?.discountValue??null,
      },
      discount: orderDetails.discount || 0,
    });

    await newOrder.save();

    await Cart.findByIdAndUpdate(orderDetails.cid, { $set: { items: [] } });

    res.json({
      message: "Payment captured and order created successfully",
      order: newOrder,
      success: true,
    });
  } catch (error) {
    console.error(
      "❌ Error capturing order:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Could not capture PayPal order" });
  }
});

router.post("/add-money", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const { amount, userId } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const return_url = `https://stitches.digital/wallet/payed?success=true&userId=${userId}`;
    const cancel_url = `https://stitches.digital/wallet/payed?cancel=true`;

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
          brand_name: "Your Store Name",
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

    // Respond with the approvalUrl and orderID
    res.json({ approvalUrl, orderID });
  } catch (error) {
    console.error(
      "Error creating wallet deposit order:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: error.message || "Could not create PayPal order" });
  }
});

router.post("/capture-wallet-payment", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const { orderID, userId } = req.body;
    if (!userId || !orderID) {
      return res.status(400).json({ message: "Missing required parameters" });
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
      console.error(
        "PayPal capture failed with status:",
        captureResponse.status
      );
      return res.status(500).json({ error: "PayPal capture failed" });
    }

    const captureData = captureResponse.data;
    const amount = parseFloat(
      captureData.purchase_units[0].payments.captures[0].amount.value
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.balance += amount;
    await user.save();

    
    const transaction = new Transaction({
      user: userId,
      transactionType: "Credited",
      amount,
      details: `Added ${amount} USD to wallet via PayPal deposit.`,
    });
    await transaction.save();

    res.json({
      message: "Payment captured and wallet updated successfully",
      transactionId: captureData.purchase_units[0].payments.captures[0].id,
      newBalance: user.balance,
      success: true,
    });
  } catch (error) {
    console.error(
      "Error capturing wallet deposit order:",
      error.response?.data || error.message
    );
    res.status(500).json(error);
  }
});

module.exports = router;
