const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model("OTP", otpSchema);
