const router = require("express").Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const protectAuth = require("../middleware/protectAuth.middleware");
const {
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../validations/categoryValidator");

router.use(protectAuth);

router.post("/", createCategoryValidator, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategoryValidator, updateCategory);
router.delete("/:id", deleteCategoryValidator, deleteCategory);

module.exports = router;
