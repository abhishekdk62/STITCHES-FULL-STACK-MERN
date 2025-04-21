const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const {
  addCoupon,
  softdeleteCoupon,
  searchDeletedCoupons,
  restoreCoupon,
  searchCoupons,
  editCoupon,
} = require("../../controllers/admin/couponController");

router.post("/addcoupon", authMiddleware("admin"), addCoupon);
router.put("/softdeletecoupon/:id", authMiddleware("admin"), softdeleteCoupon);
router.get("/searchdeletedcoupons", authMiddleware("admin"), searchDeletedCoupons);
router.put("/restorecoupon/:id", authMiddleware("admin"), restoreCoupon);
router.get("/searchcoupons", authMiddleware("admin"), searchCoupons);
router.post("/editcoupon/:id", editCoupon);

module.exports = router;
