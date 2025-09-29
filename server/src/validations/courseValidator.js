const { body, param } = require("express-validator");
const validatorError = require("../middleware/errorValidation");

exports.createCourseValidator = [
  body("title").notEmpty().isLength({ min: 3 }),
  body("description").optional().isLength({ max: 500 }),
  body("price").optional().isNumeric(),
  body("duration").optional().isString(),
  validatorError,
];

exports.updateCourseValidator = [
  param("id").isMongoId().withMessage("Invalid Course ID"),
  body("title").optional().isLength({ min: 3 }),
  body("price").optional().isNumeric(),
  body("duration").optional().isString(),
  validatorError,
];

exports.deleteCourseValidator = [
  param("id").isMongoId().withMessage("Invalid Course ID"),
  validatorError,
];
