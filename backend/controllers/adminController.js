const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Coupon = require("../models/couponSchema");
const ReturnRequest = require("../models/returnRequestSchema");
const Orders = require("../models/orderSchema");
const Transaction = require("../models/transactionSchema");
const Product = require("../models/productSchema");
const { default: mongoose } = require("mongoose");

const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {
      firstname: { $regex: searchQuery, $options: "i" },
    };

    // Count total matching users
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

const addCategorys = async (req, res) => {
  try {
    const { categoryName, description, discount, subCategories } = req.body;

    // Validate required fields
    if (!categoryName || !description || !discount) {
      return res
        .status(400)
        .json({ message: "Enter all the fields including thumbnail" });
    }

    // Check if the category already exists (case-insensitive)
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

const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

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

const addCoupon = async (req, res) => {
  try {
    const { name, discountType, discountValue, expiryDate, usageLimit } =
      req.body;
    let couponName = name;

    const code = Math.random().toString(36).slice(2, 8).toUpperCase();

    const existingCoupon = await Coupon.findOne({
      $or: [{ code }, { couponName }],
    });

    if (existingCoupon) {
      return res
        .status(400)
        .json({ message: "Coupon code or name already exists" });
    }

    // Create new coupon
    const newCoupon = new Coupon({
      code,
      couponName,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
    });

    await newCoupon.save();

    res.status(201).json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

const editCoupon = async (req, res) => {
  try {
    // Assume the coupon ID is provided in req.params.id
    const couponId = req.params.id;
    // The new data is provided in req.body
    const updateData = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
      new: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const softdeleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res
      .status(200)
      .json({ r: true, message: "Coupon soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchCoupons = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const currentDate = new Date();
    const filter = {
      couponName: { $regex: searchQuery, $options: "i" },
      expiryDate: { $gte: currentDate },

      isDeleted: false,
    };

    const total = await Coupon.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const coupon = await Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      coupon,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchCoupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchDeletedCoupons = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const currentDate = new Date();

    const coupons = await Coupon.find({
      couponName: { $regex: searchQuery, $options: "i" },
      expiryDate: { $gte: currentDate },

      isDeleted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error in searchproducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const restoreCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json("Id not found");
    }
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json("Product updated");
  } catch (error) {
    res.status(500).json("Internal server error", error);
  }
};

const getOrders = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const pipeline = [];

    pipeline.push({
      $lookup: {
        from: "products", // Ensure this matches your actual collection name
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    });

    // Stage 2: If search term provided, filter orders based on product name
    if (search) {
      pipeline.push({
        $match: {
          "productDetails.name": { $regex: search, $options: "i" },
        },
      });
    }

    // Stage 3: For each order, merge the joined product details into each item
    pipeline.push({
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$productDetails",
                          as: "pd",
                          cond: { $eq: ["$$pd._id", "$$item.product"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Stage 4: Remove the extra field from the lookup
    pipeline.push({
      $project: { productDetails: 0 },
    });

    // Count total matching orders (for pagination info)
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Orders.aggregate(countPipeline);
    const totalOrders = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalOrders / limit);

    // Stage 5: Add pagination stages
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute the pipeline
    const orders = await Orders.aggregate(pipeline);

    res.status(200).json({ data: orders, totalPages });
  } catch (error) {
    res.status(500).json(error);
  }
};

const prodEdit = async (req, res) => {
  try {
    const { orderID, product, variant, status } = req.body;

    const order = await Orders.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItem = order.items.find((i) => {
      return (
        i.product.toString() === product && i.variant.toString() === variant
      );
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    orderItem.status = status;

    await order.save();

    res.status(200).json({ message: "Order item updated", order });
  } catch (error) {
    console.error("Error updating order item:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const returnRequests = async (req, res) => {
  try {
    const returnRequests = await ReturnRequest.find({
      status: "Requested",
    }).populate("productId");
    res.status(200).json(returnRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching return requests", error });
  }
};

const approveReturn = async (req, res) => {
  try {
    const { requestId, userId, rate, quantity, pid, vid } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await ReturnRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Return request not found" });
    }

    const order = await Orders.findOne({
      _id: request.orderId,
      "items.product": request.productId,
      "items.variant": request.variantId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.items.forEach((item) => {
      if (
        item.product.toString() === request.productId.toString() &&
        item.variant.toString() === request.variantId.toString()
      ) {
        item.status = "Returned";
      }
    });
    await order.save();
    request.status = "Approved";
    await request.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance += rate;
    await user.save();

    const transactionDetails = `Order ID ${request.orderId} has been returned. Refunded ${rate} USD to user wallet.`;

    const transaction = new Transaction({
      user: userId,
      order: request.orderId,
      transactionType: "Return",
      amount: rate,
      details: transactionDetails,
    });

    await transaction.save();

    const p = await Product.findById(pid);
    if (!p) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variant = p.variants.find((v) => v._id.toString() === vid.toString());
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    variant.stock += quantity; // Increase stock
    await p.save();

    res.json({
      message: "Return request approved successfully",
      orderStatus: order.items,
      returnStatus: request.status,
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Error approving return request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectReturn = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await ReturnRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Return request not found" });
    }

    request.status = "Rejected";
    await request.save();

    res.json({
      message: "Return request rejected successfully",
      status: request.status,
    });
  } catch (error) {
    console.error("Error rejecting return request:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

const getSalesReport = async (req, res) => {
  try {
    const { r, s, e } = req.query; // r = range, s = startDate, e = endDate
    const orders = await Orders.find({})
    ;
    const deliveredItems = [];
    const now = new Date();
    const start = s ? new Date(s) : null;
    const end = e ? new Date(e) : null;
    function isSameWeek(d1, d2) {
      const startOfWeek = new Date(d2);
      startOfWeek.setDate(d2.getDate() - d2.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
    
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
    
      return d1 >= startOfWeek && d1 <= endOfWeek;
    }
    function isSameDay(d1, d2) {
      return d1.getDate() === d2.getDate() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getFullYear() === d2.getFullYear();
    }
    
    function isSameMonth(d1, d2) {
      return d1.getMonth() === d2.getMonth() &&
             d1.getFullYear() === d2.getFullYear();
    }
    
    function isSameYear(d1, d2) {
      return d1.getFullYear() === d2.getFullYear();
    }
        
    orders.forEach(order => {
      order.items
        .filter(item => item.status === "Delivered")
        .forEach(item => {
          const createdAt = new Date(order.createdAt);
          let include = false;
          if (r === "daily") include = isSameDay(createdAt, now);
          else if (r === "weekly") include = isSameWeek(createdAt, now);
          else if (r === "monthly") include = isSameMonth(createdAt, now);
          else if (r === "yearly") include = isSameYear(createdAt, now);
          else if (r === "custom" && start && end) {
            include = createdAt >= start && createdAt <= end;
          }

          if (include) {
            deliveredItems.push({
              orderID: order.orderID,
              quantity: item.quantity,
              coupon:order.coupon,
              price: item.price,
              discount: item.discount || 0,
              createdAt: order.createdAt,
            });
          }
        });
    });

    const orderCount = deliveredItems.length;
    const orderAmount = deliveredItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalDiscount = deliveredItems.reduce((sum, i) => sum + i.discount, 0);
    const couponCodes = [...new Set(deliveredItems.map(i => i.coupon).filter(Boolean))];


let totQuantity=0
let totPrice=0
let totDiscount=0
let o=await Orders.find({})
let filteredOrders = [];

o.forEach((order) => {
  const delivered = order.items.filter((item) => item.status === "Delivered");
  filteredOrders.push(...delivered);
});

const ord=await Orders.find({"items.status":"Delivered"})

ord.forEach((o)=>{
  totDiscount+=o.discount
})

 filteredOrders.forEach((o)=>{
  totQuantity+=o.quantity
 totPrice+=o.price*o.quantity
 }
)



    res.status(200).json({
      range: r,
      deliveredItemCount: orderCount,
      orderAmount,
      totalDiscount,
      couponCodes,
      deliveredItems,
      totQuantity,
      totPrice,
      totDiscount
    });

  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({ message: "Error generating sales report", error });
  }
};


module.exports = {
  searchUsers,
  restoreCoupon,
  prodEdit,
  restoreProduct,
  getSalesReport,
  softdeleteCoupon,
  addCoupon,
  getOrders,
  editCoupon,
  addCategorys,
  returnRequests,
  rejectReturn,
  approveReturn,
  searchDeletedCoupons,
  searchCategories,
  searchDeletedCategories,
  editCategories,
  softdelete,
  searchCoupons,
  addProduct,
  getCategory,
  getProdByCat,
  searchProducts,
  filteredProducts,
  getProduct,
  applyProdOffers,
  restoreCategory,
  searchDeletedProducts,
  applyCatOffers,
  softdeleteProduct,
  editProduct,
};
