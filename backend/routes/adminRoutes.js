// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middlewares/verifyToken");
// const {
//   addCoupon,
//   softdeleteCoupon,
//   searchDeletedCoupons,
//   restoreCoupon,
//   searchCoupons,
//   editCoupon,
// } = require("../controllers/admin/couponController");
// const {
//   searchProducts,
//   getProdByCat,
//   applyProdOffers,
//   getProduct,
//   addProduct,
//   searchDeletedProducts,
//   softdeleteProduct,
//   editProduct,
//   restoreProduct,
// } = require("../controllers/admin/productController");
// const {
//   searchCategories,
//   applyCatOffers,
//   getCategory,
//   addCategorys,
//   editCategories,
//   softdelete,
//   restoreCategory,
//   searchDeletedCategories,
// } = require("../controllers/admin/categoryController");
// const { searchUsers } = require("../controllers/admin/userController");
// const {
//   returnRequests,
//   rejectReturn,
//   approveReturn,
// } = require("../controllers/admin/returnController");
// const { getOrders, prodEdit } = require("../controllers/admin/orderController");
// const { getSalesReport } = require("../controllers/admin/reportController");



// //?categories routes

// router.get("/searchcategories", authMiddleware("admin"), searchCategories);
// router.post("/addcategorys", authMiddleware("admin"), addCategorys);
// router.post("/editcategories", authMiddleware("admin"), editCategories);
// router.get(
//   "/searchdeletedcat",
//   authMiddleware("admin"),
//   searchDeletedCategories
// );
// router.put("/restorecat", authMiddleware("admin"), restoreCategory);
// router.put("/softdelete/:id", authMiddleware("admin"), softdelete);

// //?products routes

// router.get("/searchproducts", authMiddleware("admin"), searchProducts);
// router.get("/productsbycat/:cid", authMiddleware("admin"), getProdByCat);
// router.post("/applyProdOffer", authMiddleware("admin"), applyProdOffers);
// router.post("/getproduct/:id", getProduct);
// router.post("/addProduct", authMiddleware("admin"), addProduct);
// router.get(
//   "/searchdeletedproducts",
//   authMiddleware("admin"),
//   searchDeletedProducts
// );
// router.put(
//   "/softdeleteproduct/:id",
//   authMiddleware("admin"),
//   softdeleteProduct
// );
// router.put("/editproduct/:id", authMiddleware("admin"), editProduct);
// router.put("/restoreprod", authMiddleware("admin"), restoreProduct);

// router.post("/applyCatOffer", authMiddleware("admin"), applyCatOffers);
// router.post("/getcategory/:id", authMiddleware("admin"), getCategory);

// //?coupon routes

// router.post("/addcoupon", authMiddleware("admin"), addCoupon);
// router.put("/softdeletecoupon/:id", authMiddleware("admin"), softdeleteCoupon);
// router.get(
//   "/searchdeletedcoupons",
//   authMiddleware("admin"),
//   searchDeletedCoupons
// );
// router.put("/restorecoupon/:id", authMiddleware("admin"), restoreCoupon);
// router.get("/searchcoupons", authMiddleware("admin"), searchCoupons);
// router.post("/editcoupon/:id", editCoupon);

// //?user routes

// router.get("/searchusers", authMiddleware("admin"), searchUsers);

// //?return routes

// router.get("/returnreq", authMiddleware("admin"), returnRequests);
// router.put("/rejectReturn", authMiddleware("admin"), rejectReturn);
// router.put("/approveReturn", authMiddleware("admin"), approveReturn);

// //?order routes

// router.get("/orders", authMiddleware("admin"), getOrders);
// router.put("/prod", authMiddleware("admin"), prodEdit);

// //?sales report routes

// router.get("/salesreport", authMiddleware("admin"), getSalesReport);

// module.exports = router;
