const Orders = require("../../models/orderSchema");
const Product = require("../../models/productSchema");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      subCategory,
      owner,
      variants, // variants: [{ color, size, stock, base_price, discount_price, discount_percentage }]
    } = req.body;

    // Calculate discount_percentage for each variant
    const updatedVariants = variants.map((variant) => {
      let discount_percentage = 0;
      if (
        variant.base_price &&
        variant.base_price !== 0 &&
        variant.discount_price != null
      ) {
        discount_percentage =
          ((variant.base_price - variant.discount_price) / variant.base_price) *
          100;
      }
      return { ...variant, discount_percentage };
    });

    const newProduct = new Product({
      name,
      description,
      brand,
      category,
      subCategory,
      owner,
      variants: updatedVariants,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, subCategory, brand, owner, category, variants } =
      req.body;

    const updatedVariants = variants.map((variant) => {
      let discount_percentage = 0;
      if (
        variant.base_price &&
        variant.base_price !== 0 &&
        variant.discount_price != null
      ) {
        discount_percentage =
          ((variant.base_price - variant.discount_price) / variant.base_price) *
          100;
      }
      return { ...variant, discount_percentage };
    });

    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({ message: "Product doesn't exist" });
    }

    // Update the product fields
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.owner = owner;
    product.subCategory = subCategory;
    product.category = category;
    (product.variants = updatedVariants), await product.save(); // Ensure saving completes before responding

    res.status(200).json({ message: "Product successfully updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const filter = {
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    };

    // Count total matching products
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Retrieve paginated products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const filteredProducts = async (req, res) => {
  try {
    const { searchTerm, category, minPrice, maxPrice, sortBy } = req.body;

    let query = {};
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.discount_price = { $gte: minPrice, $lte: maxPrice };
    }

    let sortOptions = {};
    if (sortBy === "priceAsc") sortOptions.discount_price = 1;
    if (sortBy === "priceDesc") sortOptions.discount_price = -1;
    if (sortBy === "nameAsc") sortOptions.name = 1;
    if (sortBy === "nameDesc") sortOptions.name = -1;

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const searchDeletedProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchproducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const softdeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing category ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({ message: "Product soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting Product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const restoreProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json("Id not found");
    }
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json("Product updated");
  } catch (error) {
    res.status(500).json("Internal server error", error);
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product id not available" });
    }

    const product = await Product.findOne({
      _id: id,
      isDeleted: false,
    }).populate({
      path: "category",
      match: { isDeleted: false },
    });

    if (!product || !product.category) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product details fetching successful",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getProdByCat = async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) {
      return res.status(400).json("Category id not provided");
    }

    const products = await Product.find({ category: cid });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

const applyProdOffers = async (req, res) => {
  try {
    const { offer, selectedId } = req.body;

    if (!selectedId?.vid || !selectedId?.pid || offer == null) {
      return res.status(400).json("IDs or offer value empty");
    }

    if (typeof offer !== "number" || offer < 0 || offer > 100) {
      return res.status(400).json("Invalid offer percentage");
    }

    const prod = await Product.findById(selectedId.pid);
    if (!prod) {
      return res.status(404).json("Product not found");
    }

    const item = prod.variants.find((v) => v._id.toString() === selectedId.vid);

    if (!item) {
      return res.status(404).json("Variant not found");
    }

    if (item.discount_percentage >= offer) {
      return res.status(400).json("Offers already better");
    }

    item.discount_percentage = offer;
    item.discount_price = item.base_price - item.base_price * (offer / 100);

    await prod.save();

    return res.status(200).json("Offer applied successfully");
  } catch (error) {
    console.error("Error applying offer:", error);
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  addProduct,
  applyProdOffers,
  getProdByCat,
  editProduct,
  getProduct,
  restoreProduct,
  softdeleteProduct,
  searchProducts,
  searchDeletedProducts,
  filteredProducts,
};
