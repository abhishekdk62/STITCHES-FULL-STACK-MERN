const express = require("express");
const { updateProfile } = require("../../controllers/user/profileController");
const { requestEmailChange, verifyEmailOtp, changePassword } = require("../../controllers/user/authController");
const { getTransactions } = require("../../controllers/user/transactionController");
const authMiddleware = require("../../middlewares/verifyToken");

const router = express.Router();

router.put("/userProfile", authMiddleware(["user"]), updateProfile);
router.post("/email", authMiddleware(["user"]), requestEmailChange);
router.post("/email/verify", authMiddleware(["user"]), verifyEmailOtp);
router.post("/password", authMiddleware(["user"]), changePassword);
router.get("/transactions", authMiddleware(["user"]), getTransactions);

module.exports = router;