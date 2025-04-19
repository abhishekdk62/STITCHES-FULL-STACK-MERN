const express = require("express");
const {
  searchUsers,
  getOrders,
  editCoupon,
  approveReturn,
  returnRequests,
  rejectReturn,
  prodEdit,
  restoreCoupon,
  softdeleteCoupon,
  searchDeletedCoupons,
  getSalesReport,
  addCategorys,
  restoreProduct,
  restoreCategory,
  searchDeletedCategories,
  searchCategories,
  applyProdOffers,
  editCategories,
  softdelete,
  getCategory,
  addProduct,
  searchProducts,
  getProduct,
  applyCatOffers,
  softdeleteProduct,
  editProduct,
  getProdByCat,
  searchDeletedProducts,
  addCoupon,
  searchCoupons,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/searchcategories",authMiddleware("admin"), searchCategories);
router.get("/searchproducts",authMiddleware("admin"), searchProducts);
router.get("/productsbycat/:cid", authMiddleware("admin"), getProdByCat);
router.post("/applyProdOffer", authMiddleware("admin"), applyProdOffers);
router.post("/applyCatOffer", authMiddleware("admin"), applyCatOffers);
router.post("/getproduct/:id", getProduct);
router.post("/getcategory/:id",authMiddleware("admin"), getCategory);
router.post("/addcoupon",authMiddleware("admin"), addCoupon);
router.put("/softdeletecoupon/:id", authMiddleware("admin"),softdeleteCoupon);
router.get("/searchdeletedcoupons",authMiddleware("admin"), searchDeletedCoupons);
router.put("/restorecoupon/:id",authMiddleware("admin"), restoreCoupon);
router.get("/searchcoupons", authMiddleware("admin"), searchCoupons);
router.post("/editcoupon/:id", editCoupon);
router.get("/searchusers", authMiddleware("admin"), searchUsers);
router.get("/returnreq", authMiddleware("admin"), returnRequests);
router.get("/searchusers", authMiddleware("admin"), searchUsers);
router.post("/addcategorys", authMiddleware("admin"), addCategorys);
router.post("/editcategories", authMiddleware("admin"), editCategories);
router.get("/orders", authMiddleware("admin"), getOrders);
router.put("/prod", authMiddleware("admin"), prodEdit);

router.put("/softdelete/:id", authMiddleware("admin"), softdelete);
router.post("/addProduct", authMiddleware("admin"), addProduct);
router.get(
  "/searchdeletedproducts",
  authMiddleware("admin"),
  searchDeletedProducts
);
router.put(
  "/softdeleteproduct/:id",
  authMiddleware("admin"),
  softdeleteProduct
);
router.put("/editproduct/:id", authMiddleware("admin"), editProduct);
router.put("/restoreprod", authMiddleware("admin"), restoreProduct);
router.put("/restorecat", authMiddleware("admin"), restoreCategory);
router.get(
  "/searchdeletedcat",
  authMiddleware("admin"),
  searchDeletedCategories
);

router.put("/rejectReturn", authMiddleware("admin"), rejectReturn);
router.put("/approveReturn", authMiddleware("admin"), approveReturn);
router.get("/salesreport", authMiddleware("admin"), getSalesReport);

module.exports = router;
