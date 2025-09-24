const { body } = require("express-validator");
const validatorError = require("../middleware/errorValidation");
const User = require("../models/user.model");

exports.validateCreatedUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new Error("Email is already exist");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Role must be student, teacher, or admin"),

  validatorError,
];

exports.validateUpdatedUser = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new Error("Email is already exist");
      }
      return true;
    }),

  ,
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Role must be student, teacher, or admin"),

  validatorError,
];

exports.validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  validatorError,
];
