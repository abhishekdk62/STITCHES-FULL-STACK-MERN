const Category = require("../../models/categorySchema");
const Product = require("../../models/productSchema");

const addCategorys = async (req, res) => {
  try {
    const { categoryName, description, discount, subCategories } = req.body;

    if (!categoryName || !description || !discount) {
      return res
        .status(400)
        .json({ message: "Enter all the fields including thumbnail" });
    }

    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    });
    if (category) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category
    const newCategory = new Category({
      name: categoryName,
      description,
      discount,
      subCategories,
    });

    await newCategory.save(); // Ensure saving completes before responding

    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const editCategories = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      subCategories,
      isActive,
      discount,
      productsCount,
    } = req.body;

    // Fetch the category being edited
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({ message: "Category doesn't exist" });
    }

    // Check if another category already exists with the same name (case-insensitive)
    const duplicateCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: id }, // Exclude the current category
    });
    if (duplicateCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    // Update category fields; optionally, you can store the name as provided
    category.name = name;
    category.subCategories = subCategories;
    category.description = description;
    category.isActive = isActive;
    category.discount = discount;
    category.productsCount = productsCount;

    await category.save();

    res
      .status(200)
      .json({ message: "Category successfully updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchCategories = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Build the filter object
    const filter = {
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: false, // Only active categories
    };

    // Count the total number of matching documents
    const total = await Category.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Retrieve the categories with pagination
    const categories = await Category.find(filter)
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      categories,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchCategories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchDeletedCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isDeleted: true, // Exclude soft-deleted categories
    }).sort({ createdAt: -1 }); // Sort by latest first

    res.json(categories);
  } catch (error) {
    console.error("Error in searchCategories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const softdelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the isDeleted field instead of deleting the document
    await Category.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({ message: "Category soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const restoreCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "category id not available" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json({ message: "Category updated from backend" });
  } catch (error) {
    res.status(500).json({ "error is": error });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params; // Assuming id is passed as a URL parameter
    if (!id) {
      return res.status(400).json({ message: "Category id not available" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category details fetching succesfull",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const applyCatOffers = async (req, res) => {
  try {
    const { offer, cid } = req.body;

    if (!offer || !cid) {
      return res.status(400).json("id or offer value missing");
    }

    const category = await Category.findById(cid);
    if (!category) {
      return res.status(400).json("Category not found");
    }

    const products = await Product.find({ category: cid });

    if (!products || products.length === 0) {
      return res.status(404).json("No products found for this category");
    }

    let updatedAnyProduct = false;

    for (let product of products) {
      let prodWithOfferLess = product.variants.filter(
        (v) => v.discount_percentage < offer
      );

      if (prodWithOfferLess.length > 0) {
        prodWithOfferLess.forEach((p) => {
          p.discount_percentage = offer;
          p.discount_price = Math.round(
            p.base_price - (p.base_price * offer) / 100
          );
        });

        await product.save();
        updatedAnyProduct = true;
      }
    }

    if (updatedAnyProduct) {
      category.discount = offer;
      await category.save();
      return res
        .status(200)
        .json("Category offer applied successfully to products");
    } else {
      return res.status(400).json("Offers already better");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

module.exports = {
  addCategorys,
  editCategories,
  applyCatOffers,
  searchCategories,
  searchDeletedCategories,
  softdelete,
  restoreCategory,
  getCategory,
};
