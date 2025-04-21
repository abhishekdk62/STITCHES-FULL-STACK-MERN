const User = require("../../models/userSchema");


const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {
      firstname: { $regex: searchQuery, $options: "i" },
    };

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Retrieve paginated users (excluding the password field)
    const users = await User.find(filter, "-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      users,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  searchUsers,
};
