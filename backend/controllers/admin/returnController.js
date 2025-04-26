const User = require("../../models/userSchema");

const ReturnRequest = require("../../models/returnRequestSchema");
const Orders = require("../../models/orderSchema");
const Transaction = require("../../models/transactionSchema");
const Product = require("../../models/productSchema");

const returnRequests = async (req, res) => {
  try {
    const returnRequests = await ReturnRequest.find({
      status: "Requested",
    }).populate("productId");
    res.status(200).json(returnRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching return requests", error });
  }
};

const approveReturn = async (req, res) => {
  try {
    const { requestId, userId, rate, quantity, pid, vid } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await ReturnRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Return request not found" });
    }

    const order = await Orders.findOne({
      _id: request.orderId,
      "items.product": request.productId,
      "items.variant": request.variantId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.items.forEach((item) => {
      if (
        item.product.toString() === request.productId.toString() &&
        item.variant.toString() === request.variantId.toString()
      ) {
        item.status = "Returned";
      }
    });
    await order.save();
    request.status = "Approved";
    await request.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance += rate;
    await user.save();

    const transactionDetails = `Order ID ${request.orderId} has been returned. Refunded ${rate} Rs to user wallet.`;

    const transaction = new Transaction({
      user: userId,
      order: request.orderId,
      transactionType: "Return",
      amount: rate,
      details: transactionDetails,
    });

    await transaction.save();

    const p = await Product.findById(pid);
    if (!p) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variant = p.variants.find((v) => v._id.toString() === vid.toString());
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    variant.stock += quantity; // Increase stock
    await p.save();

    res.json({
      message: "Return request approved successfully",
      orderStatus: order.items,
      returnStatus: request.status,
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Error approving return request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectReturn = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await ReturnRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Return request not found" });
    }

    request.status = "Rejected";
    await request.save();

    res.json({
      message: "Return request rejected successfully",
      status: request.status,
    });
  } catch (error) {
    console.error("Error rejecting return request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { returnRequests, rejectReturn, approveReturn };
