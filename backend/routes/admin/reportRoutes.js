const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/verifyToken");
const { getSalesReport, getTopSellers } = require("../../controllers/admin/reportController");

router.get("/salesreport", authMiddleware("admin"), getSalesReport);
router.get("/topsellers", authMiddleware("admin"), getTopSellers);

module.exports = router;
