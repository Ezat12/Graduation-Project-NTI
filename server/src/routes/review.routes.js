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
} = require("../controllers/review.controller");

router.post("/:courseId", createReviewValidator, createReview);

router.get("/", allowedTo("admin"), getAllReviews);
router.get("/:courseId", getAllReviewsToCourse);
router.get("/:id", getReviewById);

router.put("/:id", updateReviewValidator, updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
