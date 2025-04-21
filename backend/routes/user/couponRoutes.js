const express = require("express");
const authMiddleware = require("../../middlewares/verifyToken");
const { getCoupons, applyCoupon } = require("../../controllers/user/couponController");
const router = express.Router();

router.get("/coupons", authMiddleware(["user"]), getCoupons);
router.post("/coupon", authMiddleware(["user"]), applyCoupon);

module.exports = router;