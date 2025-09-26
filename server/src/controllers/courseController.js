const Course = require('../models/course');
const asyncHandler = require('express-async-handler');
const AppError = require("../utils/apiError");

exports.createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
    res.status(201).json({
    status: "success",
    message: "Course created successfully",
    data: course,
});
});

exports.getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
   if (!courses) {
    return next(new AppError("No courses found", 404));
  }

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: courses,
  });
});

exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
     return next(new AppError("course not found", 404));

  }
    res.status(200).json({
    status: "success",
    data: course,
  });
});