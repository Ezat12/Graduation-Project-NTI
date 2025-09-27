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

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body)
  if(!course) {
    return next(new AppError("Course not found", 404))
  }
  res.status(200).json({
    status: "success",
    message: "Course updated successfully",
    data: course
  })
})

exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id)
  if(!course) {
    return next(new AppError("Course not found", 404))
  }
  res.status(200).json({
    status: "success", 
    message: "Course deleted successfully"
  })
})

exports.deleteLecture = asyncHandler(async (req, res) => {
  const{ courseId, lectureId } = req.params
  const course = await Course.findById(courseId)
  if(!course) {
    return next(new AppError("Course not found", 404))
  }
  const lectureIndex = course.lectures.findIndex((lecture => lecture._id.toString() === lectureId))
  if(lectureIndex === -1) {
    return next(new AppError("Lecture not found", 404))
  }
  course.lectures.splice(lectureIndex, 1)
  await course.save()
  res.status(200).json({
    status: "success", 
    message: "Lecture deleted successfully",
    data: course
  })
})