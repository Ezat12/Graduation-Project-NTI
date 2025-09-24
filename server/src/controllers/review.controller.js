const Review = require("../models/reviewModel");
const asyncHandler = require("express-async-handler");

const createReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findOne({ $and: { courseId, userId } });
  if (review) {
    return next(new ApiError("You have already review on this course", 400));
  }
  const newReview = new Review({ userId, courseId, rating, comment });
  await newReview.save();
  res.status(201).json({ status: " success", data: newReview });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate("userId").populate("courseId");
  res.status(200).json({ status: "success", data: reviews });
});

const getAllReviewsToCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ApiError("Course not found", 404));
  }

  const reviews = await Review.find({ courseId })
    .populate("userid")
    .populate("courseId");

  res.status(200).json({ status: "success", data: reviews });
});

const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate("userId")
    .populate("courseId");
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }
  res.status(200).json({ status: "success", data: review });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not allowed to update this review", 403));
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({ status: "success", data: updatedReview });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not allowed to delete this review", 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = {
  createReview,
  getAllReviews,
  getAllReviewsToCourse,
  getReviewById,
  updateReview,
  deleteReview,
};
