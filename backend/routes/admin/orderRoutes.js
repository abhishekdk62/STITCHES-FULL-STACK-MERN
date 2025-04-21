const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const { getOrders, prodEdit } = require("../../controllers/admin/orderController");

router.get("/orders", authMiddleware("admin"), getOrders);
router.put("/prod", authMiddleware("admin"), prodEdit);

module.exports = router;
