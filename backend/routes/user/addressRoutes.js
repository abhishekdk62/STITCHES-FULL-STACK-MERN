const express = require("express");

const authMiddleware = require("../../middlewares/verifyToken");
const { addAddress, getAddress, editAddress, deleteAddress } = require("../../controllers/user/addressController");
const router = express.Router();

router.post("/address", authMiddleware(["user"]), addAddress);
router.get("/address", authMiddleware(["user"]), getAddress);
router.put("/address/:id", authMiddleware(["user"]), editAddress);
router.delete("/address/:id", authMiddleware(["user"]), deleteAddress);

module.exports = router;