
const Review = require("../../models/reviewSchema");
const { default: mongoose } = require("mongoose");

const addReview = async (req, res) => {
  try {
    const { newReview, productId } = req.body;
    const userId = req.user.id;

    if (
      newReview.text == null ||
      newReview.rating == null ||
      productId == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newData = new Review({
      productId,
      userId,
      rating: newReview.rating,
      comment: newReview.text,
    });

    await newData.save();
    res.status(200).json({ message: "Review added succesfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You have already reviewed this product" });
    }

    res
      .status(500)
      .json({ message: "Error Adding review", error: error.message });
  }
};
const getReview = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product id not availabke" });
    }
    const reviews = await Review.find({ productId }).populate("userId");

    res.status(200).json({ data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const ratings = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const getRating = async (req, res) => {
  try {
    const { id } = req.body;

    const rating = await Review.aggregate([
      {
        $match: { productId: new mongoose.Types.ObjectId(id) },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addReview,
  getReview,
  getRatings,
  getRating,
};

