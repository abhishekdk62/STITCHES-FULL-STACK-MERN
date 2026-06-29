const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Order = require("../../models/orderSchema");
const Coupons = require("../../models/couponSchema");
const Transaction = require("../../models/transactionSchema");
const Cart = require("../../models/cartSchema");

const createOrder = async (req, res) => {
  try {
    const user = req.user.id;
    const {
      cartid,
      cartItems,
      address,
      paymentMethod,
      totalPrice,
      tax,
      shippingPrice,
      grandTotal,
      discount,
      couponData,
    } = req.body;

    if (
      !cartid ||
      !cartItems ||
      !address ||
      !paymentMethod ||
      totalPrice == null ||
      tax == null ||
      shippingPrice == null ||
      grandTotal == null
    ) {
      return res
        .status(400)
        .json({ message: "Missing required order fields." });
    }

    const transformedItems = cartItems.map((item) => ({
      product: item.productId._id,
      variant: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));

    if (couponData?.code || couponData?._id) {
      const coupon = await Coupons.findById(couponData._id);
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const orderID = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    if (paymentMethod === "wallet") {
      const userDoc = await User.findById(user);
      if (!userDoc || userDoc.balance < grandTotal) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      await User.findByIdAndUpdate(user, { $inc: { balance: -grandTotal } });

      const transactionDetails = `${grandTotal} Rs has been deducted from your wallet for the Order with ID ${orderID}.`;

      const transaction = new Transaction({
        user,
        order: cartid,
        transactionType: "Debited",
        amount: grandTotal,
        currency: "Rs",
        details: transactionDetails,
      });

      await transaction.save();
    }

    const newOrder = new Order({
      user,
      orderID,
      items: transformedItems,
      address: {
        addressType: address.addressType,
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      },
      paymentMethod,
      totalPrice,
      grandTotal,
      coupon: {
        code: couponData?.code || null,
        value: couponData?.discountValue || null,
      },
      tax: tax || 0,
      shippingPrice: shippingPrice || 0,
      discount: discount || 0,
      paymentStatus: paymentMethod === "wallet" ? "Paid" : "Pending",
    });

    await newOrder.save();
    await Cart.findByIdAndUpdate(cartid, { $set: { items: [] } });

    for (const item of transformedItems) {
      await Product.updateOne(
        { _id: item.product, "variants._id": item.variant },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .populate("items.variant");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const cancelOrderItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { productId, variantId, quantity, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to cancel this order." });
    }

    const itemIndex = order.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Order item not found." });
    }
    if (order.items[itemIndex].status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "This item is already cancelled." });
    }

    const cancelledItem = order.items[itemIndex];
    const refundAmount = cancelledItem.price * quantity;

    order.items[itemIndex].status = "Cancelled";
    await order.save();

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $inc: { "variants.$.stock": quantity } },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or variant not found." });
    }

    let transactionDetails = `Order ID ${orderId} item cancelled.`;

    if (paymentMethod !== "cod") {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.balance += refundAmount;
      await user.save();
      transactionDetails += ` Refunded ${refundAmount} Rs to user wallet.`;

      const transaction = new Transaction({
        user: userId,
        order: orderId,
        transactionType: "Cancellation",
        amount: refundAmount,
        details: transactionDetails,
      });
      await transaction.save();
    }

    res.status(200).json({
      message:
        "Order item cancelled successfully, stock updated, and refund processed.",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrderItem,
};
