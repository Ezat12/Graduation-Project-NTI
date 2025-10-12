const { body, check } = require("express-validator");
const validatorError = require("../middleware/errorValidation");
const Course = require("../models/course");

exports.addStudentCourseValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("Invalid courseId format")
    .custom(async (value, { req }) => {
      const course = await Course.findById(value);


      if (!course) {
        throw new Error("Course not found");
      }
      return true;
    }),
  validatorError,
];

exports.removeStudentCourseValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("Invalid courseId format")
    .custom(async (value, { req }) => {
      const course = await Course.findById(value);

      if (!course) {
        throw new Error("Course not found");
      }

      return true;
    }),
  validatorError,
];
