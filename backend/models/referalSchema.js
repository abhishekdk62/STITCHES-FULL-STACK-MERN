const mongoose = require("mongoose");

const referalSchema = new mongoose.Schema(
  {
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    usedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiryDate: { type: Date, required: true },
    couponName: { 
      type: String, 
      required: true,
      default: "REFERAL COUPON"
    },
    usedCount: { type: Number, default: 0 },
    usageLimit: { 
      type: Number, 
      required: true,
      default: 1
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
      default: "percentage"
    },
    discountValue: { 
      type: Number, 
      required: true,
      default: 50 
    },
    isDeleted: {
      type: Boolean,
      default: false,  
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referalSchema);
