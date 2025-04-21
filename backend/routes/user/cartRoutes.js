const express = require("express");
const { 
  addToCart, 
  getCartItems, 
  changeQuantity, 
  deleteItem, 
  checkInCart 
} = require("../../controllers/user/cartController");
const authMiddleware = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/cart", authMiddleware(["user"]), addToCart);
router.get("/cart", authMiddleware(["user"]), getCartItems);
router.put("/cart", authMiddleware(["user"]), changeQuantity);
router.delete("/cart", authMiddleware(["user"]), deleteItem);
router.post("/checkincart", authMiddleware(["user"]), checkInCart);

module.exports = router;