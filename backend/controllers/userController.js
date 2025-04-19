const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library"); // Added for verifying Google token
const client = new OAuth2Client(process.env.CLIENT_ID); // Initialize using CLIENT_ID from .env
const Product = require("../models/productSchema");
const Address = require("../models/addressSchema");
const Order = require("../models/orderSchema"); // adjust the path as needed
const OTPModel = require("../models/otpSchema");
const Category = require("../models/categorySchema");
const Coupons = require("../models/couponSchema");
const ReturnRequest = require("../models/returnRequestSchema");
const Wishlist = require("../models/wishlistShema");
const Transaction = require("../models/transactionSchema");
const Referal = require("../models/referalSchema");
const Cart = require("../models/cartSchema");
const Review = require("../models/reviewSchema");
const { default: mongoose } = require("mongoose");
const generateToken = require("../utils/generateToken");
const { log } = require("console");
const sendEmail = require("../utils/sendMail");

const signupOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    await OTPModel.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );
    await sendEmail(
      email,
      "Email Verification OTP expiring in 5 minutes",
      otp.toString()
    );
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTPModel.findOne({ email });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }
    if (otpRecord.otp !== otp || otpRecord.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    await OTPModel.deleteOne({ email });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};
const signup = async (req, res) => {
  try {
    const { email, name, phone, password, referralCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const existingNum = await User.findOne({ phone: phone });
    if (existingNum) {
      return res.status(400).json("Phone Number already registeed");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedReferalCode = Math.random()
      .toString(36)
      .slice(2, 10)
      .toUpperCase();
    const newUser = new User({
      email,
      firstname: name,
      lastname: "",
      phone,
      password: hashedPassword,
      role: "user",
      referalCode: generatedReferalCode,
    });
    await newUser.save();
    if (referralCode) {
      const refUser = await User.findOne({ referalCode: referralCode });
      if (!refUser) {
        return res.status(400).json("Invalid referral code");
      }
      const code = Math.random().toString(32).slice(2, 6).toUpperCase();

      const codeString = "REF" + code;

      const daysToAdd = 30;

      const expiryDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

      const refer = new Referal({
        uid: refUser._id,
        usedById: newUser._id,
        code: codeString,
        expiryDate,
      });
      await refer.save();
    }

    const token = generateToken(newUser._id, newUser.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Signup successful",
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during signup", error: error.message });
  }
};



// const signup = async (req, res) => {
//   try {
//     const { email, name, phone, password, referralCode } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const existingNum = await User.findOne({ phone: phone });
//     if (existingNum) {
//       return res.status(400).json({ message: "Phone Number already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const generatedReferalCode = Math.random()
//       .toString(36)
//       .slice(2, 10)
//       .toUpperCase();

//     const newUser = new User({
//       email,
//       firstname: name,
//       lastname: "",
//       phone,
//       password: hashedPassword,
//       role: "user",
//       referalCode: generatedReferalCode,
//     });
//     await newUser.save();

//     if (referralCode) {
//       const refUser = await User.findOne({ referalCode: referralCode });
//       if (!refUser) {
//         return res.status(400).json({ message: "Invalid referral code" });
//       }
//       const code = Math.random().toString(32).slice(2, 6).toUpperCase();
//       const codeString = "REF" + code;
//       const daysToAdd = 30;
//       const expiryDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

//       const refer = new Referal({
//         uid: refUser._id,
//         usedById: newUser._id,
//         code: codeString,
//         expiryDate,
//       });
//       await refer.save();
//     }

//     const accessToken = generateToken(newUser._id, newUser.role, "access");
//     const refreshToken = generateToken(newUser._id, newUser.role, "refresh");

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(201).json({
//       message: "Signup successful",
//       accessToken,
//       userId: newUser._id,
//       role: newUser.role,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error during signup", error: error.message });
//   }
// };





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

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not found. Please sign up first." });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    await User.findOneAndUpdate({ email }, { otp, otpExpiry }, { new: true });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    await User.findOneAndUpdate(
      { email },
      { $unset: { otp: 1, otpExpiry: 1 } }
    );

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

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

    const prods = await Product.find({ category: categoryId })
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
    const { searchTerm, category, minPrice, maxPrice, sortBy, page, limit } =
      req.body;

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;

    let match = { isDeleted: false };
    if (searchTerm) {
      match.name = { $regex: searchTerm, $options: "i" };
    }
    if (category) {
      match.category = new mongoose.Types.ObjectId(category);
    }

    const pipeline = [];
    pipeline.push({ $match: match });

    // Lookup category details
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

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword, otp: null, otpExpiry: null }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};
const addReview = async (req, res) => {
  try {
    const { newReview, productId, userId } = req.body;
    if (
      newReview.text == null ||
      newReview.rating == null ||
      productId == null ||
      userId == null
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
        $match: { productId: new mongoose.Types.ObjectId(id) }, // Convert to ObjectId
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
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      street,
      city,
      state,
      addressType,
      zipCode,
      country,
      phone,
      defaultBilling,
    } = req.body;

    const user = req.user.id;
    if (
      !fullName ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phone ||
      !addressType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newAddress = new Address({
      user,
      fullName,
      street,
      city,
      state,
      addressType,
      zipCode,
      country,
      phone,
      isDefault: defaultBilling || false,
    });
    await newAddress.save();
    await User.findByIdAndUpdate(newAddress.user, {
      $push: { addresses: newAddress._id },
    });
    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      gender,
      profileImage,
      dateOfBirth,
      phone,
      avatar,
    } = req.body;

    // Get the authenticated user's ID (set by your auth middleware)
    const userId = req.user.id;

    const updateFields = {};
    if (firstname !== undefined) updateFields.firstname = firstname;
    if (lastname !== undefined) updateFields.lastname = lastname;
    if (gender !== undefined) updateFields.gender = gender;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (phone !== undefined) updateFields.phone = phone;
    if (avatar !== undefined) updateFields.profileImage = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};
const editAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      street,
      city,
      state,
      addressType,
      zipCode,
      country,
      phone,
      defaultBilling,
    } = req.body;

    const user = req.user.id;

    const address = await Address.findOne({ _id: id, user });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    address.fullName = fullName || address.fullName;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.phone = phone || address.phone;
    address.addressType = addressType || address.addressType;
    address.isDefault = defaultBilling ?? address.isDefault;
    await address.save();
    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.id; // Ensure the request has user info

    if (!id) {
      return res.status(400).json({ message: "Address ID not provided" });
    }

    const address = await Address.findOne({ _id: id, user });
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or unauthorized" });
    }

    await Address.findByIdAndDelete(id);

    await User.findByIdAndUpdate(user, { $pull: { addresses: id } });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const userId = req.user.id;
    if (!newEmail) {
      return res.status(400).json({ message: "New email is required." });
    }
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    const otpCode = crypto.randomInt(100000, 999999).toString();

    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    await User.findByIdAndUpdate(userId, { otp: otpCode, otpExpiry });
    await sendEmail(
      newEmail,
      "Email Change OTP",
      `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in requestEmailChange:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const userId = req.user.id;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required." });
    }
    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    // Check if the new email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Fetch the logged-in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate OTP
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Update the user's email and clear OTP fields
    user.email = newEmail;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email updated successfully." });
  } catch (error) {
    console.error("Error in requestEmailChange:", error);
    res
      .status(500)
      .json({ message: "Error updating email", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body;
    const userId = req.user.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const variant = product.variants.find((v) => v._id.equals(variantId));
    if (!variant) {
      return res.status(404).json({ message: "Selected variant not found." });
    }
    if (variant.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
        tax: 0,
        shippingPrice: 0,
      });
    } else if (
      cart.items.find(
        (i) => i.productId.equals(productId) && i.variantId.equals(variantId)
      )
    ) {
      return res.status(400).json({ message: "Item already in the cart" });
    }
    cart.items.push({
      productId,
      variantId,
      quantity,
      price: variant.discount_price || variant.base_price,
    });
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    let taxRate = 0.12;
    cart.tax = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price * taxRate,
      0
    );
    cart.tax = parseFloat(cart.tax.toFixed(2));

    cart.shippingPrice = cart.totalPrice > 499 ? 0 : 50;
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const changeQuantity = async (req, res) => {
  try {
    const { cid, pid, vid, quantity } = req.body;
    if (!cid || !pid || !vid || !quantity) {
      return res.status(400).json({ message: "IDs and quantity not provided" });
    }
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find(
      (item) => item.productId.equals(pid) && item.variantId.equals(vid)
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const variant = product.variants.find((v) => v._id.equals(vid));
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    if (quantity > variant.stock) {
      return res
        .status(400)
        .json({ message: "Quantity exceeds available stock" });
    }
    if (quantity > 5) {
      return res
        .status(400)
        .json({ message: "Cannot add more than 5 of the same item" });
    }
    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // ✅ Update tax
    let taxRate = 0.12;
    cart.tax = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price * taxRate,
      0
    );
    cart.tax = parseFloat(cart.tax.toFixed(2)); // Ensure proper rounding

    await cart.save();

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const createOrder = async (req, res) => {
  try {
    const user = req.user.id;
    const {
      cartid,
      cartItems,
      address,
      paymentMethod,
      totalPrice,
      tax,
      shippingPrice,
      grandTotal,
      discount,
      couponData,
    } = req.body;

    if (
      !cartid ||
      !cartItems ||
      !address ||
      !paymentMethod ||
      totalPrice == null ||
      tax == null ||
      shippingPrice == null ||
      grandTotal == null
    ) {
      return res
        .status(400)
        .json({ message: "Missing required order fields." });
    }

    const transformedItems = cartItems.map((item) => ({
      product: item.productId._id,
      variant: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));
    if(couponData.length>0)
    {
      let coupon=await Coupons.findById(couponData._id)
    coupon.usedCount += 1;
  
coupon.save()
    }

    if (paymentMethod === "wallet") {
      await User.findByIdAndUpdate(user, { $inc: { balance: -grandTotal } });

      const transaction = new Transaction({
        user,
        order: cartid,
        transactionType: "Debited",
        amount: grandTotal,
        currency: "USD",
        details: `${grandTotal} has been deducted from your wallet`,
      });

      await transaction.save();
    }

    const newOrder = new Order({
      user,
      items: transformedItems,
      address: {
        addressType: address.addressType,
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      },
      paymentMethod,
      totalPrice,
      grandTotal,
      coupon: { code: couponData.code||null, value: couponData.discountValue||null },
      tax: tax || 0,
      shippingPrice: shippingPrice || 0,
      discount: discount || 0,
      paymentStatus: paymentMethod === "wallet" ? "Paid" : "Pending",
    });

    await newOrder.save();
    await Cart.findByIdAndUpdate(cartid, { $set: { items: [] } });

    for (const item of transformedItems) {
      await Product.updateOne(
        { _id: item.product, "variants._id": item.variant },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const cancelOrderItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { productId, variantId, quantity, paymentMethod, grandTotal } =
      req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    const itemIndex = order.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Order item not found." });
    }
    if (order.items[itemIndex].status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "This item is already cancelled." });
    }
    order.items[itemIndex].status = "Cancelled";
    await order.save();
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $inc: { "variants.$.stock": quantity } },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or variant not found." });
    }
    let transactionDetails = `Order ID ${orderId} has been cancelled.`;

    if (paymentMethod === "paypal") {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      try {
        user.balance += grandTotal;
        await user.save();
        transactionDetails += ` Refunded ${grandTotal} USD to user wallet.`;
      } catch (error) {
        console.error("Error updating user balance:", error);
        return res
          .status(500)
          .json({ message: "Failed to update user balance." });
      }
    }

    if (paymentMethod != "cod") {
      const transaction = new Transaction({
        user: userId,
        order: orderId,
        transactionType: "Cancellation",
        amount: grandTotal,
        details: transactionDetails,
      });
      await transaction.save();
    }

    res.status(200).json({
      message:
        "Order item cancelled successfully, stock updated, and refund processed.",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all orders for the given user with populated fields
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .populate("items.variant");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = getUserOrders;

const deleteItem = async (req, res) => {
  try {
    const itemid = req.body.itemId;
    const cartId = req.body.cartId;

    if (!itemid || !cartId) {
      return res
        .status(400)
        .json({ message: "Item ID and Cart ID are required" });
    }
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex((i) => i._id.equals(itemid));
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();
    return res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId, selectedVariant } = req.body;
    const userId = req.user.id;

    if (!productId || !selectedVariant) {
      return res
        .status(400)
        .json({ message: "Product or Variant data missing" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      const itemExists = wishlist.items.find(
        (item) =>
          item.productId.equals(productId) &&
          item.selectedVariant._id.toString() === selectedVariant._id.toString()
      );

      if (itemExists) {
        return res.status(400).json({ message: "Item already in wishlist" });
      }

      wishlist.items.push({ productId, selectedVariant });
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Item added to wishlist", wishlist });
    } else {
      wishlist = new Wishlist({
        userId,
        items: [{ productId, selectedVariant }],
      });
      await wishlist.save();
      return res
        .status(201)
        .json({ message: "Item added to wishlist", wishlist });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is not provided" });
    }

    // Retrieve the user's wishlist and populate product details
    const wishlistDoc = await Wishlist.findOne({ userId }).populate(
      "items.productId"
    );
    if (!wishlistDoc || !wishlistDoc.items || wishlistDoc.items.length === 0) {
      return res
        .status(404)
        .json({ message: "Wishlist is empty", wishlist: [] });
    }

    // Retrieve the user's cart
    const cart = await Cart.findOne({ userId });
    const cartItems = cart?.items || [];

    const filteredWishlistItems = wishlistDoc.items.filter((wItem) => {
      const wishlistProductId =
        wItem?.productId?._id?.toString() || wItem?.productId?.toString() || "";
      const wishlistVariantId =
        wItem?.selectedVariant?._id?.toString() ||
        wItem?.selectedVariant?.toString() ||
        "";

      if (!wishlistProductId || !wishlistVariantId) return false;

      const existsInCart = cartItems.some((cItem) => {
        const cartProductId = cItem?.productId?.toString() || "";
        const cartVariantId = cItem?.variantId?.toString() || "";
        return (
          cartProductId === wishlistProductId &&
          cartVariantId === wishlistVariantId
        );
      });

      return !existsInCart;
    });

    const sortedWishlistItems = filteredWishlistItems.sort((a, b) => {
      return new Date(b.addedAt) - new Date(a.addedAt);
    });
    

    return res.status(200).json({ wishlist: sortedWishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    if (!id || !userId) {
      return res
        .status(400)
        .json({ message: "User id and wishlist id are required" });
    }

  
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    
    const itemIndex = wishlist.items.findIndex((item) => item._id.equals(id));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return res
      .status(200)
      .json({ message: "Wishlist item successfully removed", wishlist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const requestReturn = async (req, res) => {
  const { orderId, productId, variantId, reason, quantity } = req.body;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(
      (v) =>
        v.product.toString() === productId && v.variant.toString() === variantId
    );

    if (!item) {
      return res.status(400).json({ message: "Product not found in order" });
    }

    if (item.status !== "Delivered") {
      return res
        .status(400)
        .json({ message: "Only delivered products can be returned" });
    }

    const existingRequest = await ReturnRequest.findOne({
      orderId,
      productId,
      variantId,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Return request already submitted for this item" });
    }

    const returnRequestObj = new ReturnRequest({
      orderId,
      userId,
      productId,
      variantId,
      reason,
      status: "Requested",
      quantity,
    });

    await returnRequestObj.save();
    res.status(201).json({ message: "Return request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkReturn = async (req, res) => {
  try {
    const { oid: orderId, pid: productId, vid: variantId } = req.query;

    if (!orderId || !productId || !variantId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const returnRequest = await ReturnRequest.findOne({
      orderId,
      productId,
      variantId,
    });

    if (!returnRequest) {
      return res.status(404).json({ message: "No return request found" });
    }

    res.json({ status: returnRequest.status });
  } catch (error) {
    console.error("Error checking return status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const uid = req.user.id;
    const now = new Date();

    const expiredCoupons = await Coupons.find({
      expiryDate: { $lte: now },
      isDeleted: false,
    });

    if (expiredCoupons.length > 0) {
      for (const coupon of expiredCoupons) {
        coupon.isDeleted = true;
        await coupon.save(); 
      }
    }

    const expiredRefCoupons = await Referal.find({
      expiryDate: { $lte: now },
      isDeleted: false,
    });

    if (expiredRefCoupons.length > 0) {
      for (const refCoupon of expiredRefCoupons) {
        refCoupon.isDeleted = true;
        await refCoupon.save(); 
      }
    }

    const coupons = await Coupons.find({
      isDeleted: false,
    });

    const refCoupons = await Referal.find({
      uid,
      isDeleted: false, 
    });

    res.status(200).json({ coupons, refCoupons });
  } catch (error) {
    res.status(500).json(error);
  }
};


const getAddress = async (req, res) => {
  try {
    const uid = req.user.id;
    const user = await User.findById(uid).populate("addresses");
    if (!user) {
      return res.status(400).json("user not found");
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkInCart = async (req, res) => {
  try {
    const { pid, vid } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({
      userId,
      "items.productId": pid,
      "items.variantId": vid,
    });

    if (cart) {
      return res.status(200).json({ inCart: true });
    }

    res.status(200).json({ inCart: false });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    if (couponCode === "") {
      return res.status(200).json({ message: "Coupon removed" });
    }

    let coupon = await Coupons.findOne({ code: couponCode, isDeleted: false });
    if (!coupon) {
      coupon = await Referal.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).json("Coupon doesn't exist");
      }
    }

    const now = new Date();

    if (coupon.usedCount >= coupon.usageLimit || now >= coupon.expiryDate) {
      coupon.isDeleted = true; 
      await coupon.save();
      return res.status(400).json("Coupon is no longer valid");
    }

    await coupon.save();

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = {
  getSimilarProducts,
  getCoupons,
  applyCoupon,
  createOrder,
  signup,
  getCartItems,
  requestEmailChange,
  getRatings,
  updateProfile,
  getWishlist,
  removeWishlist,
  requestReturn,
  checkInCart,
  deleteItem,
  deleteAddress,
  getUserOrders,
  addToCart,
  changeQuantity,
  verifyEmailOtp,
  filteredProducts,
  addToWishlist,
  sendOTP,
  checkReturn,
  editAddress,
  verifyOTP,
  addAddress,
  getRating,
  getTransactions,
  addReview,
  getReview,
  searchCategoriesToFilter,
  getNewArrivals,
  getAddress,
  cancelOrderItem,
  searchProducts,
  changePassword,
  signupOTP,
  verifySignupOTP,
  resetPassword,
  getCategoryName,
  categoryWiseProducs,
};
