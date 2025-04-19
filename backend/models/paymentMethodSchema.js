const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    methodType: { type: String, enum: ["Card", "PayPal", "UPI"], required: true },
    details: {
      cardNumber: { type: String },
      cardHolderName: { type: String },
      expiryDate: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
