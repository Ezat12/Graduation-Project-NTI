const router = require("express").Router();
const { validate } = require("express-validation");
const categoryCtrl = require("../controllers/categoryController");
const {createCategoryValidation,updateCategoryValidation,} = require("../validations/categoryValidator");
router.post("/", validate(createCategoryValidation), categoryCtrl.createCategory);
router.get("/", categoryCtrl.getCategories);
router.get("/:id", categoryCtrl.getCategory);
router.put("/:id", validate(updateCategoryValidation), categoryCtrl.updateCategory);
router.delete("/:id", categoryCtrl.deleteCategory);

module.exports = router;
