const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const { getSalesReport } = require("../../controllers/admin/reportController");

router.get("/salesreport", authMiddleware("admin"), getSalesReport);

module.exports = router;
