const Course = require("../models/course");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/apiError");
const apiFeatures = require("../utils/apiFeature");
const ApiError = require("../utils/apiError");

exports.createCourse = asyncHandler(async (req, res) => {
  const body = { ...req.body, instructorId: req.user._id };
  const course = await Course.create(body);
  res.status(201).json({
    status: "success",
    message: "Course created successfully",
    data: course,
  });
});

exports.getCourses = asyncHandler(async (req, res) => {
  const countCourses = await Course.countDocuments();
  const feature = new apiFeatures(
    Course.find().populate("category instructorId", "_id name email"),
    req.query
  )
    .fields()
    .sort()
    .filtering()
    .search()
    .pagination(countCourses);

  const { paginationResult, mongooseQuery } = feature;
  const courses = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: courses.length,
    paginationResult,
    data: courses,
  });
});

exports.getInstructorCourses = asyncHandler(async (req, res, next) => {
  const instructorId = req.user?._id;

  const countCourses = await Course.countDocuments({ instructorId });
  const feature = new apiFeatures(
    Course.find({ instructorId }).populate("category", "_id name"),
    req.query
  )
    .fields()
    .sort()
    .filtering()
    .search()
    .pagination(countCourses);

  const { paginationResult, mongooseQuery } = feature;
  const courses = await mongooseQuery;

  res.status(200).json({
    status: "success",
    results: courses.length,
    paginationResult,
    data: courses,
  });
});

exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "category instructorId",
    "_id name email"
  );
  if (!course) {
    return next(new AppError("course not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Course updated successfully",
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Course deleted successfully",
  });
});

exports.addLecture = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (course.instructorId.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to add lectures to this course", 403)
    );
  }

  if (!title || !videoUrl) {
    return next(
      new ApiError("Title lecture and videoUrl must be required", 400)
    );
  }

  const newLecture = {
    title: req.body.title,
    freePreview: req.body.freePreview || false,
    videoUrl: req.body.videoUrl,
    public_id: req.body.public_id || null,
  };

  course.lectures.push(newLecture);
  await course.save();

  res.status(201).json({
    status: "success",
    message: "Lecture added successfully",
    data: {
      course: course._id,
      lecture: newLecture,
    },
  });
});

exports.updateLecture = asyncHandler(async (req, res, next) => {
  const { courseId, lectureId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (course.instructorId.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "You are not authorized to update lectures in this course",
        403
      )
    );
  }

  const lecture = course.lectures.id(lectureId);
  if (!lecture) {
    return next(new AppError("Lecture not found", 404));
  }

  if (req.body.title) lecture.title = req.body.title;
  if (req.body.hasOwnProperty("freePreview"))
    lecture.freePreview = req.body.freePreview;
  if (req.body.videoUrl) lecture.videoUrl = req.body.videoUrl;
  if (req.body.public_id) lecture.public_id = req.body.public_id;

  await course.save();

  res.status(200).json({
    status: "success",
    message: "Lecture updated successfully",
    data: lecture,
  });
});

exports.deleteLecture = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }
  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId
  );
  if (lectureIndex === -1) {
    return next(new AppError("Lecture not found", 404));
  }
  course.lectures.splice(lectureIndex, 1);
  await course.save();
  res.status(200).json({
    status: "success",
    message: "Lecture deleted successfully",
    data: course,
  });
});
