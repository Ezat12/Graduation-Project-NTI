const express = require("express");
const router = express.Router();

const {
  createReviewValidator,
  updateReviewValidator,
} = require("../validations/reviewValidator");
const {
  createReview,
  getAllReviewsToCourse,
  getAllReviewsInstructor,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");
const allowedTo = require("../middleware/allowedTo.middleware");
const protectAuth = require("../middleware/protectAuth.middleware");
router.use(protectAuth);

router.post("/:courseId", createReviewValidator, createReview);

router.get("/", allowedTo("instructor"), getAllReviewsInstructor);
router.get("/course/:courseId", getAllReviewsToCourse);
router.get("/:id", getReviewById);

router.put("/:id", updateReviewValidator, updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
