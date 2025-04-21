const express = require("express");
const { createOrder, getUserOrders, cancelOrderItem } = require("../../controllers/user/orderController");
const { requestReturn, checkReturn } = require("../../controllers/user/returnController");
const authMiddleware = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/order", authMiddleware(["user"]), createOrder);
router.get("/orders", authMiddleware(["user"]), getUserOrders);
router.put("/orders/:orderId", authMiddleware(["user"]), cancelOrderItem);
router.post("/return", authMiddleware(["user"]), requestReturn);
router.get("/checkReturns", authMiddleware(["user"]), checkReturn);

module.exports = router;