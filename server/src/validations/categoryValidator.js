const { body, param } = require("express-validator");
const validatorError = require("../middleware/errorValidation");

exports.createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters"),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  validatorError,
];

exports.updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID format"),

  validatorError,
];

exports.deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID format"),

  validatorError,
];
