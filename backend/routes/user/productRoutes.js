const express = require("express");
const { 
  getNewArrivals, 
  categoryWiseProducs, 
  getSimilarProducts, 
  filteredProducts, 
  searchProducts 
} = require("../../controllers/user/productController");
const { 
  searchCategoriesToFilter, 
  getCategoryName 
} = require("../../controllers/user/categoryController");

const router = express.Router();

router.get("/searchcategoriestofilter", searchCategoriesToFilter);
router.get("/new-arrivals", getNewArrivals);
router.post("/categoryWiseProducs", categoryWiseProducs);
router.post("/getsimilarproducts", getSimilarProducts);
router.get("/products", searchProducts);
router.post("/products", filteredProducts);
router.post("/getcategoryname", getCategoryName);

module.exports = router;