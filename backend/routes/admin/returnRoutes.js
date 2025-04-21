const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const {
  returnRequests,
  rejectReturn,
  approveReturn,
} = require("../../controllers/admin/returnController");

router.get("/returnreq", authMiddleware("admin"), returnRequests);
router.put("/rejectReturn", authMiddleware("admin"), rejectReturn);
router.put("/approveReturn", authMiddleware("admin"), approveReturn);

module.exports = router;
