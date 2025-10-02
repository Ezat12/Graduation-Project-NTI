const { body } = require("express-validator");
const mongoose = require("mongoose");
const validatorError = require("../middleware/errorValidation");

const courseValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2 characters long")
    .trim(),

  body("imageUrl")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .trim(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isArray({ min: 1 })
    .withMessage("At least one category is required")
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Category must be an array");
      }

      for (const categoryId of value) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          throw new Error("Invalid category ID format");
        }
      }
      return true;
    }),

  body("language")
    .optional()
    .isArray()
    .withMessage("Language must be an array")
    .custom((value) => {
      if (value && Array.isArray(value)) {
        const allowedLanguages = ["English", "Arabic", "French", "Spanish"];
        for (const lang of value) {
          if (!allowedLanguages.includes(lang)) {
            throw new Error(
              `Invalid language: ${lang}. Allowed languages are: ${allowedLanguages.join(
                ", "
              )}`
            );
          }
        }
      }
      return true;
    }),

  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["Beginner", "Intermediate", "Advanced", "All levels"])
    .withMessage("Invalid level"),

  body("objective")
    .optional()
    .isArray()
    .withMessage("Objective must be an array")
    .custom((value) => {
      if (value && Array.isArray(value)) {
        for (const obj of value) {
          if (typeof obj !== "string") {
            throw new Error("All objectives must be strings");
          }
        }
      }
      return true;
    }),

  body("lectures")
    .optional()
    .isArray()
    .withMessage("Lectures must be an array")
    .custom((lectures) => {
      if (lectures && Array.isArray(lectures)) {
        for (let i = 0; i < lectures.length; i++) {
          const lecture = lectures[i];

          // Validate lecture title
          if (!lecture.title || typeof lecture.title !== "string") {
            throw new Error(
              `Lecture ${i + 1}: Title is required and must be a string`
            );
          }
          if (lecture.title.length < 4) {
            throw new Error(
              `Lecture ${i + 1}: Title must be at least 4 characters long`
            );
          }

          // Validate freePreview
          if (typeof lecture.freePreview !== "boolean") {
            throw new Error(`Lecture ${i + 1}: Free preview must be a boolean`);
          }

          // Validate videoUrl
          if (!lecture.videoUrl || typeof lecture.videoUrl !== "string") {
            throw new Error(`Lecture ${i + 1}: Video URL is required`);
          }
        }
      }
      return true;
    }),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  validatorError,
];

const courseUpdateValidationRules = [
  body("title")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2 characters long")
    .trim(),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .trim(),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Category must be an array with at least one item")
    .custom((value) => {
      if (value && Array.isArray(value)) {
        for (const categoryId of value) {
          if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new Error("Invalid category ID format");
          }
        }
      }
      return true;
    }),

  body("language")
    .optional()
    .isArray()
    .withMessage("Language must be an array")
    .custom((value) => {
      if (value && Array.isArray(value)) {
        const allowedLanguages = ["English", "Arabic", "French", "Spanish"];
        for (const lang of value) {
          if (!allowedLanguages.includes(lang)) {
            throw new Error(
              `Invalid language: ${lang}. Allowed languages are: ${allowedLanguages.join(
                ", "
              )}`
            );
          }
        }
      }
      return true;
    }),

  body("level")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced", "All levels"])
    .withMessage("Invalid level"),

  body("objective")
    .optional()
    .isArray()
    .withMessage("Objective must be an array")
    .custom((value) => {
      if (value && Array.isArray(value)) {
        for (const obj of value) {
          if (typeof obj !== "string") {
            throw new Error("All objectives must be strings");
          }
        }
      }
      return true;
    }),

  body("lectures")
    .optional()
    .isArray()
    .withMessage("Lectures must be an array")
    .custom((lectures) => {
      if (lectures && Array.isArray(lectures)) {
        for (let i = 0; i < lectures.length; i++) {
          const lecture = lectures[i];

          if (lecture.title && lecture.title.length < 4) {
            throw new Error(
              `Lecture ${i + 1}: Title must be at least 4 characters long`
            );
          }

          if (lecture.freePreview && typeof lecture.freePreview !== "boolean") {
            throw new Error(`Lecture ${i + 1}: Free preview must be a boolean`);
          }
        }
      }
      return true;
    }),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  validatorError,
];

module.exports = {
  courseValidationRules,
  courseUpdateValidationRules,
};
