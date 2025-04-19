const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    role: {
      type: String, 
      required: true, 
    },
    refreshToken: { 
      type: String, 
      required: true, 
      unique: true 
    },
    expiryDate: { 
      type: Date, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
