const express = require("express");
const { addReview, getReview, getRatings, getRating } = require("../../controllers/user/reviewController");
const authMiddleware = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/review", authMiddleware(["user"]), addReview);
router.post("/reviews", authMiddleware(["user"]), getReview);
router.get("/ratings", authMiddleware(["user"]), getRatings);
router.post("/rating", authMiddleware(["user"]), getRating);

module.exports = router;