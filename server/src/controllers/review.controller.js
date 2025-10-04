const Review = require("../models/reviewModel");
const Course = require("../models/course");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const apiFeatures = require("../utils/apiFeature");

const createReview = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ApiError("Course not found", 404));
  }

  const review = await Review.findOne({ $and: [{ courseId }, { userId }] });
  if (review) {
    return next(new ApiError("You have already review on this course", 400));
  }
  const newReview = new Review({ userId, courseId, rating, comment });
  const oldCount = course.reviewsCount;
  const oldRating = course.rating;

  course.reviewsCount = oldCount + 1;

  course.rating = (oldRating * oldCount + rating) / course.reviewsCount;

  await newReview.save();
  await course.save();

  res.status(201).json({ status: " success", data: newReview });
});

const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find().populate("userId").populate("courseId");
  // const count
  res.status(200).json({ status: "success", data: reviews });
});

const getAllReviewsToCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const countReviews = await Review.countDocuments({ courseId });
  const feature = new apiFeatures(
    Review.find({ courseId }).populate("userId", "_id name email"),
    req.query
  )
    .fields()
    .sort()
    .filtering()
    .search()
    .pagination(countReviews);

  const { paginationResult, mongooseQuery } = feature;
  const reviews = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: reviews.length,
    paginationResult,
    data: reviews,
  });
});

const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate(
    "userId",
    "_id name email"
  );
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

  if (review.userId.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not allowed to update this review", 403));
  }

  const course = await Course.findById(review.courseId);
  if (!course) {
    return next(new ApiError("Course not found", 404));
  }

  let newRating = req.body.rating;
  if (newRating) {
    const oldRating = review.rating;

    course.rating =
      (course.rating * course.reviewsCount - oldRating + newRating) /
      course.reviewsCount;
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  await course.save();

  res.status(200).json({ status: "success", data: updatedReview });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not allowed to delete this review", 403));
  }

  const course = await Course.findById(review.courseId);
  if (!course) {
    return next(new ApiError("Course not found", 404));
  }

  course.reviewsCount = course.reviewsCount - 1;

  if (course.reviewsCount > 0) {
    course.rating =
      (course.rating * (course.reviewsCount + 1) - review.rating) /
      course.reviewsCount;
  } else {
    course.rating = 0;
  }

  await course.save();
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
