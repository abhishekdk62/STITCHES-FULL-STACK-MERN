const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    phone: { type: String, required: true },
    referalCode: {
      type: String,
      unique: true,
    },
    firstname: { type: String, required: true },
    lastname: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }], // ADDED: support for multiple addresses
    status: { type: String, default: "Active" },
    balance: { type: Number, default: 0 },
    profileImage: { type: String, default: "" },
    dateOfBirth: { type: Date },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    otp: { type: String }, // Field for storing OTP
    otpExpiry: { type: Number }, // Field for OTP expiry time
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }, // ADDED: Reference to the user's cart
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // ADDED: Array of order references
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // ADDED: Array of product references in wishlist
    paymentMethods: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" },
    ], // ADDED: Array of saved payment methods
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
