const express = require("express");
const { 
  signup, 
  sendOTP, 
  verifyOTP, 
  resetPassword, 
  signupOTP, 
  verifySignupOTP,
  changePassword,
  requestEmailChange,
  verifyEmailOtp
} = require("../../controllers/user/authController");
const authMiddleware = require("../../middlewares/verifyToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/update-password", resetPassword);
router.post("/signupotp", signupOTP);
router.post("/verifysignupotp", verifySignupOTP);
router.post("/password", authMiddleware(), changePassword);
router.post("/email", authMiddleware(), requestEmailChange);
router.post("/email/verify", authMiddleware(), verifyEmailOtp);

module.exports = router;