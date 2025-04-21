
const Category = require("../../models/categorySchema");


const getCategoryName = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" }); // Prevents searching with undefined/null
    }

    const cat = await Category.findById(id);

    if (!cat) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(cat);
  } catch (error) {
    console.error("Error fetching category:", error); // Logs error for debugging
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const searchCategoriesToFilter = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const categories = await Category.find({
      name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
      isDeleted: false, // Exclude soft-deleted categories
    }).sort({ createdAt: -1 }); // Sort by latest first

    res.json(categories);
  } catch (error) {
    console.error("Error in searchCategories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCategoryName,
  searchCategoriesToFilter,
};
