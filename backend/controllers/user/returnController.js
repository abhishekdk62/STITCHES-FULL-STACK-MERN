
const Order = require("../../models/orderSchema"); // adjust the path as needed

const ReturnRequest = require("../../models/returnRequestSchema");




const requestReturn = async (req, res) => {
  const { orderId, productId, variantId, reason, quantity } = req.body;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(
      (v) =>
        v.product.toString() === productId && v.variant.toString() === variantId
    );

    if (!item) {
      return res.status(400).json({ message: "Product not found in order" });
    }

    if (item.status !== "Delivered") {
      return res
        .status(400)
        .json({ message: "Only delivered products can be returned" });
    }

    const existingRequest = await ReturnRequest.findOne({
      orderId,
      productId,
      variantId,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Return request already submitted for this item" });
    }

    const returnRequestObj = new ReturnRequest({
      orderId,
      userId,
      productId,
      variantId,
      reason,
      status: "Requested",
      quantity,
    });

    await returnRequestObj.save();
    res.status(201).json({ message: "Return request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkReturn = async (req, res) => {
  try {
    const { oid: orderId, pid: productId, vid: variantId } = req.query;

    if (!orderId || !productId || !variantId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const returnRequest = await ReturnRequest.findOne({
      orderId,
      productId,
      variantId,
    });

    if (!returnRequest) {
      return res.status(404).json({ message: "No return request found" });
    }

    res.json({ status: returnRequest.status });
  } catch (error) {
    console.error("Error checking return status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  requestReturn,
  checkReturn,
};

