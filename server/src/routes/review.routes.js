const express = require("express");
const router = express.Router();

const {
  createReviewValidator,
  updateReviewValidator,
} = require("../validations/reviewValidator");
const {
  getAllReviews,
  createReview,
  getAllReviewsToCourse,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");
const allowedTo = require("../middleware/allowedTo.middleware");

router.post("/:courseId", createReviewValidator, createReview);

router.get("/", allowedTo("admin"), getAllReviews);
router.get("/:courseId", getAllReviewsToCourse);
router.get("/:id", getReviewById);

router.put("/:id", updateReviewValidator, updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
