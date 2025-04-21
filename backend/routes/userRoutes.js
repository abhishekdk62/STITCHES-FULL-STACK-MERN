// const express = require("express");
// const {
//   addAddress,
//   getWishlist,
//   addToWishlist,
//   checkReturn,
//   getAddress,
//   requestReturn,
//   removeWishlist,
//   getCartItems,
//   deleteItem,
//   changeQuantity,
//   updateProfile,
//   getTransactions,
//   checkInCart,
//   addToCart,
//   changePassword,
//   getCoupons,
//   applyCoupon,
//   verifyEmailOtp,
//   requestEmailChange,
//   deleteAddress,
//   editAddress,
//   signup,
//   getCategoryName,
//   signupOTP,
//   verifySignupOTP,
//   sendOTP,
//   searchCategoriesToFilter,
//   getRating,
//   getRatings,
//   verifyOTP,
//   getNewArrivals,
//   categoryWiseProducs,
//   resetPassword,
//   searchProducts,
//   getSimilarProducts,
//   filteredProducts,
//   getReview,
//   addReview,
//   createOrder,
//   getUserOrders,
//   cancelOrderItem,
// } = require("../controllers/userController");
// const authMiddleware = require("../middlewares/verifyToken");
// const router = express.Router();

// router.post("/signup", signup);
// router.post("/send-otp", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/update-password", resetPassword);
// router.get("/searchcategoriestofilter", searchCategoriesToFilter);
// router.post("/signupotp", signupOTP);
// router.post("/verifysignupotp", verifySignupOTP);
// router.get("/new-arrivals",  getNewArrivals);
// router.post("/categoryWiseProducs",  categoryWiseProducs);
// router.post("/getsimilarproducts",  getSimilarProducts);
// router.get("/products",  searchProducts);
// router.put("/userProfile", authMiddleware("user"), updateProfile);
// router.post("/address", authMiddleware("user"), addAddress);
// router.post("/email", authMiddleware("user"), requestEmailChange);
// router.put("/address/:id", authMiddleware("user"), editAddress);
// router.delete("/address/:id", authMiddleware("user"), deleteAddress);
// router.post("/email/verify", authMiddleware("user"),verifyEmailOtp);
// router.post("/coupon", authMiddleware("user"), applyCoupon);

// router.post("/order", authMiddleware("user"), createOrder);
// router.get("/orders", authMiddleware("user"), getUserOrders);
// router.put("/orders/:orderId", authMiddleware("user"), cancelOrderItem);
// router.post("/return", authMiddleware("user"), requestReturn);
// router.post("/checkincart", authMiddleware("user"), checkInCart);
// router.get("/checkReturns", authMiddleware("user"), checkReturn);

// router.post("/wishlist", authMiddleware("user"), addToWishlist);
// router.get("/wishlist", authMiddleware("user"), getWishlist);
// router.delete("/wishlist/:id", authMiddleware("user"), removeWishlist);

// router.post("/cart", authMiddleware("user"), addToCart);
// router.get("/cart", authMiddleware("user"), getCartItems);
// router.put("/cart", authMiddleware("user"), changeQuantity);
// router.delete("/cart", authMiddleware("user"), deleteItem);

// router.post("/products", filteredProducts);
// router.post("/review",authMiddleware("user"),  addReview);
// router.post("/password", authMiddleware("user"), changePassword);
// router.post("/getcategoryname",  getCategoryName);
// router.get("/ratings",authMiddleware("user"),  getRatings);
// router.post("/rating",authMiddleware("user"),  getRating);
// router.post("/reviews",authMiddleware("user"), getReview);


// router.get("/transactions",authMiddleware("user"), getTransactions);
// router.get("/coupons",authMiddleware("user"), getCoupons);
// router.get("/address",authMiddleware("user"), getAddress);

// module.exports = router;
