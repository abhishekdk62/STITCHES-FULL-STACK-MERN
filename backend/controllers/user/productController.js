const Product = require("../../models/productSchema");

const Category = require("../../models/categorySchema");

const { default: mongoose } = require("mongoose");

const getNewArrivals = async (req, res) => {
  try {
    // Fetch the 4 most recent products
    const newArrivals = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: newArrivals,
      message: "New arrivals fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching new arrivals",
      error: error.message,
    });
  }
};

const categoryWiseProducs = async (req, res) => {
  try {
    const { catName } = req.body;
    const trimmedCatName = catName.trim();
    // Allow any whitespace after the trimmed string:
    const regex = new RegExp(`^${trimmedCatName}\\s*$`, "i");
    const category = await Category.findOne({ name: regex });

    if (!category) {
      return res
        .status(400)
        .json({ message: `${catName} Category Not found from backend` });
    }

    const prods = await Product.find({
      category: category._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: prods,
      message: `${catName} collections fetched successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching ${catName} collections`,
      error: error.message,
    });
  }
};

const getSimilarProducts = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const prods = await Product.find({ category: categoryId,isDeleted:false })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: prods,
      message: `collections fetched successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching collections`,
      error: error.message,
    });
  }
};

const filteredProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, page, limit } =
      req.body;
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;

    let match = { isDeleted: false };
    if (search && search.trim() !== "") {
      match.name = { $regex: search.trim(), $options: "i" };
    }
    if (category) {
      match.category = new mongoose.Types.ObjectId(category);
    }

    const pipeline = [];
    pipeline.push({ $match: match });

    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    });

    // Filter products where category is not deleted
    pipeline.push({
      $match: {
        "categoryData.isDeleted": false,
      },
    });

    pipeline.push({
      $addFields: {
        minDiscountPrice: { $min: "$variants.discount_price" },
      },
    });

    if (minPrice !== undefined && maxPrice !== undefined) {
      pipeline.push({
        $match: {
          minDiscountPrice: {
            $gte: parseFloat(minPrice),
            $lte: parseFloat(maxPrice),
          },
        },
      });
    }

    let sortStage = {};
    if (sortBy === "priceAsc") sortStage.minDiscountPrice = 1;
    if (sortBy === "priceDesc") sortStage.minDiscountPrice = -1;
    if (sortBy === "nameAsc") sortStage.name = 1;
    if (sortBy === "nameDesc") sortStage.name = -1;
    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    pipeline.push({
      $facet: {
        totalCount: [{ $count: "count" }],
        products: [{ $skip: (currentPage - 1) * perPage }, { $limit: perPage }],
      },
    });

    const result = await Product.aggregate(pipeline);
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / perPage);
    const products = result[0].products;

    res.status(200).json({
      products,
      total: totalCount,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchproducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getNewArrivals,
  categoryWiseProducs,
  getSimilarProducts,
  filteredProducts,
  searchProducts,
};
