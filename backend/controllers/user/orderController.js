const User = require("../../models/userSchema");

const Product = require("../../models/productSchema");

const Order = require("../../models/orderSchema"); // adjust the path as needed

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
    if(couponData.length>0)
    {
      let coupon=await Coupons.findById(couponData._id)
    coupon.usedCount += 1;
  
coupon.save()
    }

    if (paymentMethod === "wallet") {
      await User.findByIdAndUpdate(user, { $inc: { balance: -grandTotal } });

      const transaction = new Transaction({
        user,
        order: cartid,
        transactionType: "Debited",
        amount: grandTotal,
        currency: "USD",
        details: `${grandTotal} has been deducted from your wallet`,
      });

      await transaction.save();
    }

    const newOrder = new Order({
      user,
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
      coupon: { code: couponData.code||null, value: couponData.discountValue||null },
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

    // Fetch all orders for the given user with populated fields
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
    const { productId, variantId, quantity, paymentMethod, grandTotal } =
      req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
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
    let transactionDetails = `Order ID ${orderId} has been cancelled.`;

    if (paymentMethod === "paypal") {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      try {
        user.balance += grandTotal;
        await user.save();
        transactionDetails += ` Refunded ${grandTotal} USD to user wallet.`;
      } catch (error) {
        console.error("Error updating user balance:", error);
        return res
          .status(500)
          .json({ message: "Failed to update user balance." });
      }
    }

    if (paymentMethod != "cod") {
      const transaction = new Transaction({
        user: userId,
        order: orderId,
        transactionType: "Cancellation",
        amount: grandTotal,
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

