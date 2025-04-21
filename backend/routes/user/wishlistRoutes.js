const express = require("express");
const { addToWishlist, getWishlist, removeWishlist } = require("../../controllers/user/wishlistController");
const authMiddleware = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/wishlist", authMiddleware(["user"]), addToWishlist);
router.get("/wishlist", authMiddleware(["user"]), getWishlist);
router.delete("/wishlist/:id", authMiddleware(["user"]), removeWishlist);

module.exports = router;