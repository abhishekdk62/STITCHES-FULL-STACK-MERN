const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const { searchUsers } = require("../../controllers/admin/userController");

router.get("/searchusers", authMiddleware("admin"), searchUsers);

module.exports = router;
