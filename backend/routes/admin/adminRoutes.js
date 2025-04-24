const express = require("express");
const router = express.Router();

router.use("/", require("./categoryRoutes"));
router.use("/", require("./productRoutes"));
router.use("/", require("./couponRoutes"));
router.use("/", require("./userRoutes"));
router.use("/", require("./returnRoutes"));
router.use("/", require("./orderRoutes"));
router.use("/", require("./reportRoutes"));
router.use("/", require("./transactionRoutes"));

module.exports = router;



