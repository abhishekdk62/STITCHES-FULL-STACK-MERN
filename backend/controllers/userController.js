// const User = require("../models/userSchema");
// const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");
// const { OAuth2Client } = require("google-auth-library"); // Added for verifying Google token
// const client = new OAuth2Client(process.env.CLIENT_ID); // Initialize using CLIENT_ID from .env
// const Product = require("../models/productSchema");
// const Address = require("../models/addressSchema");
// const Order = require("../models/orderSchema"); // adjust the path as needed
// const OTPModel = require("../models/otpSchema");
// const Category = require("../models/categorySchema");
// const Coupons = require("../models/couponSchema");
// const ReturnRequest = require("../models/returnRequestSchema");
// const Wishlist = require("../models/wishlistShema");
// const Transaction = require("../models/transactionSchema");
// const Referal = require("../models/referalSchema");
// const Cart = require("../models/cartSchema");
// const Review = require("../models/reviewSchema");
// const { default: mongoose } = require("mongoose");
// const generateToken = require("../utils/generateToken");
// const { log } = require("console");
// const sendEmail = require("../utils/sendMail");




// // const signup = async (req, res) => {
// //   try {
// //     const { email, name, phone, password, referralCode } = req.body;

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }
// //     const existingNum = await User.findOne({ phone: phone });
// //     if (existingNum) {
// //       return res.status(400).json({ message: "Phone Number already registered" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const generatedReferalCode = Math.random()
// //       .toString(36)
// //       .slice(2, 10)
// //       .toUpperCase();

// //     const newUser = new User({
// //       email,
// //       firstname: name,
// //       lastname: "",
// //       phone,
// //       password: hashedPassword,
// //       role: "user",
// //       referalCode: generatedReferalCode,
// //     });
// //     await newUser.save();

// //     if (referralCode) {
// //       const refUser = await User.findOne({ referalCode: referralCode });
// //       if (!refUser) {
// //         return res.status(400).json({ message: "Invalid referral code" });
// //       }
// //       const code = Math.random().toString(32).slice(2, 6).toUpperCase();
// //       const codeString = "REF" + code;
// //       const daysToAdd = 30;
// //       const expiryDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

// //       const refer = new Referal({
// //         uid: refUser._id,
// //         usedById: newUser._id,
// //         code: codeString,
// //         expiryDate,
// //       });
// //       await refer.save();
// //     }

// //     const accessToken = generateToken(newUser._id, newUser.role, "access");
// //     const refreshToken = generateToken(newUser._id, newUser.role, "refresh");

// //     res.cookie("refreshToken", refreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === "production",
// //       sameSite: "strict",
// //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// //     });

// //     res.status(201).json({
// //       message: "Signup successful",
// //       accessToken,
// //       userId: newUser._id,
// //       role: newUser.role,
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error during signup", error: error.message });
// //   }
// // };






























  

// module.exports = {
//   getSimilarProducts,
//   getCoupons,
//   applyCoupon,
//   createOrder,
//   signup,
//   getCartItems,
//   requestEmailChange,
//   getRatings,
//   updateProfile,
//   getWishlist,
//   removeWishlist,
//   requestReturn,
//   checkInCart,
//   deleteItem,
//   deleteAddress,
//   getUserOrders,
//   addToCart,
//   changeQuantity,
//   verifyEmailOtp,
//   filteredProducts,
//   addToWishlist,
//   sendOTP,
//   checkReturn,
//   editAddress,
//   verifyOTP,
//   addAddress,
//   getRating,
//   getTransactions,
//   addReview,
//   getReview,
//   searchCategoriesToFilter,
//   getNewArrivals,
//   getAddress,
//   cancelOrderItem,
//   searchProducts,
//   changePassword,
//   signupOTP,
//   verifySignupOTP,
//   resetPassword,
//   getCategoryName,
//   categoryWiseProducs,
// };
