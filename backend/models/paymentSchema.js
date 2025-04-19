const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    paymentMethod: { type: String, enum: ["Card", "PayPal", "UPI", "Cash"], required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, unique: true, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
