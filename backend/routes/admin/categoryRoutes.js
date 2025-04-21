const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/verifyToken");
const {
  searchCategories,
  applyCatOffers,
  getCategory,
  addCategorys,
  editCategories,
  softdelete,
  restoreCategory,
  searchDeletedCategories,
} = require("../../controllers/admin/categoryController");

router.get("/searchcategories", authMiddleware("admin"), searchCategories);
router.post("/addcategorys", authMiddleware("admin"), addCategorys);
router.post("/editcategories", authMiddleware("admin"), editCategories);
router.get("/searchdeletedcat", authMiddleware("admin"), searchDeletedCategories);
router.put("/restorecat", authMiddleware("admin"), restoreCategory);
router.put("/softdelete/:id", authMiddleware("admin"), softdelete);
router.post("/applyCatOffer", authMiddleware("admin"), applyCatOffers);
router.post("/getcategory/:id", getCategory);

module.exports = router;
