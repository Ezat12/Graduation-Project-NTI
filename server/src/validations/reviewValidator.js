const { body, check } = require("express-validator");
const validatorError = require("../middleware/errorValidation");
const Review = require("../models/reviewModel");
const Course = require("../models/course");

const createReviewValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("courseId must be a valid Mongo ID")
    .custom(async (value, { req }) => {
      const course = await Course.findById(value);

      if (!course) {
        throw new Error("Course not found");
      }
      return true;
    }),

  ,
  body("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("comment must be a string")
    .isLength({ max: 500 })
    .withMessage("comment cannot exceed 500 characters"),
  validatorError,
];

const updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("id review is required")
    .isMongoId()
    .withMessage("id review must be a valid Mongo ID")
    .custom(async (value, { req }) => {
      const review = await Review.findById(value);

      if (!review) {
        throw new Error("Review not found");
      }
      return true;
    }),

  ,
  body("rating")
    .optional()
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("comment must be a string")
    .isLength({ max: 500 })
    .withMessage("comment cannot exceed 500 characters"),
  validatorError,
];

module.exports = { createReviewValidator, updateReviewValidator };
