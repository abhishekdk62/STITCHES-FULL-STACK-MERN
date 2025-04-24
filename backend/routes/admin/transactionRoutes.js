const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const { getTransactions } = require("../../controllers/admin/transactionController");

router.get("/transactions", authMiddleware("admin"), getTransactions);

module.exports = router;
