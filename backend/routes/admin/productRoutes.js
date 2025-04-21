const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const {
  searchProducts,
  getProdByCat,
  applyProdOffers,
  getProduct,
  addProduct,
  searchDeletedProducts,
  softdeleteProduct,
  editProduct,
  restoreProduct,
} = require("../../controllers/admin/productController");

router.get("/searchproducts", authMiddleware("admin"), searchProducts);
router.get("/productsbycat/:cid", authMiddleware("admin"), getProdByCat);
router.post("/applyProdOffer", authMiddleware("admin"), applyProdOffers);
router.post("/getproduct/:id", getProduct);
router.post("/addProduct", authMiddleware("admin"), addProduct);
router.get("/searchdeletedproducts", authMiddleware("admin"), searchDeletedProducts);
router.put("/softdeleteproduct/:id", authMiddleware("admin"), softdeleteProduct);
router.put("/editproduct/:id", authMiddleware("admin"), editProduct);
router.put("/restoreprod", authMiddleware("admin"), restoreProduct);

module.exports = router;
