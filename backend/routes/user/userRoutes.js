const express = require("express");
const router = express.Router();

// Import all route files
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const userProfileRoutes = require("./userProfileRoutes");
const addressRoutes = require("./addressRoutes");
const orderRoutes = require("./orderRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const cartRoutes = require("./cartRoutes");
const reviewRatingRoutes = require("./reviewRatingRoutes");
const couponRoutes = require("./couponRoutes");

router.use("/", authRoutes);
router.use("/", productRoutes);
router.use("/", userProfileRoutes);
router.use("/", addressRoutes);
router.use("/", orderRoutes);
router.use("/", wishlistRoutes);
router.use("/", cartRoutes);
router.use("/", reviewRatingRoutes);
router.use("/", couponRoutes);

module.exports = router;