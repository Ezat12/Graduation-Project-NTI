const asyncHandler = require("express-async-handler");
const StudentCourse = require("../models/studentCourse");
const ApiError = require("../utils/apiError");
const Course = require("../models/course");
const User = require("../models/user.model");
const apiFeatures = require("../utils/apiFeature");

exports.addCourseToStudent = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  console.log("Adding course to student:", { courseId, userId });

  let studentCourse = await StudentCourse.findOne({ userId });

  if (!studentCourse) {
    studentCourse = new StudentCourse({
      userId,
      courses: [courseId],
    });
  } else {
    if (!studentCourse.courses.includes(courseId)) {
      studentCourse.courses.push(courseId);
    }
  }

  await studentCourse.save();

  const populatedStudentCourse = await StudentCourse.findById(studentCourse._id)
    .populate("userId", "name email")
    .populate("courses", "title description price");

  res.status(200).json({
    status: "success",
    message: "Course added to student successfully",
    data: populatedStudentCourse,
  });
});

exports.getStudentCourses = asyncHandler(async (req, res, next) => {
  const sc = await StudentCourse.find({ userId: req.user._id }).populate(
    "courses"
  );

  return res.status(200).json({ status: "success", data: sc });
});

exports.getAllStudentToInstructor = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const instructorId = req.user._id;
  const user = await User.findById(instructorId);

  console.log(user);

  if (!user) {
    return next(new ApiError("Instructor not found", 404));
  }

  const instructorCourses = await Course.find({
    instructorId: instructorId,
  }).select("_id");
  const courseIds = instructorCourses.map((course) => course._id);

  if (courseIds.length === 0) {
    return next(new ApiError("No courses found for this instructor", 404));
  }

  const countStudent = await StudentCourse.countDocuments({
    courses: { $in: courseIds },
  });

  const feature = new apiFeatures(
    StudentCourse.find({ courses: { $in: courseIds } })
      .populate("userId", "name email isActive")
      .populate("courses", "title description price"),
    req.query
  )
    .fields()
    .sort()
    .filtering()
    .search()
    .pagination(countStudent);

  const { paginationResult, mongooseQuery } = feature;
  const students = await mongooseQuery;

  res.status(200).json({
    message: "Students found",
    results: students.length,
    paginationResult,
    data: students,
  });
});

exports.removeStudentFromCourse = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const courseId = req.params.courseId;

  console.log("Removing course from student:", { courseId, userId });

  if (!userId || !courseId) {
    return next(new ApiError("User ID and Course ID are required", 400));
  }

  const sc = await StudentCourse.findOne({ userId });
  if (!sc) {
    return next(new ApiError("No courses found for this student", 404));
  }

  const exists = sc.courses.some((cId) => cId.toString() === courseId);
  if (!exists) {
    return next(new ApiError("Course not found for this student", 404));
  }

  sc.courses = sc.courses.filter((cId) => cId.toString() !== courseId);
  await sc.save();

  const coursesStudent = await StudentCourse.findById(sc._id)
    .populate("userId", "name email")
    .populate("courses", "title description price");

  res.status(200).json({
    status: "success",
    message: "Course removed from student successfully",
    data: coursesStudent,
  });
});

exports.progressInCourse = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const courseId = req.params.courseId;

  console.log("Getting course progress for student:", { courseId, userId });

  if (!userId || !courseId) {
    return next(new ApiError("User ID and Course ID are required", 400));
  }

  const sc = await StudentCourse.findOne({ userId });
  if (!sc) {
    return next(new ApiError("No courses found for this student", 404));
  }

  const courseEntry = sc.courses.find(
    (entry) => entry.toString() === courseId.toString()
  );
  if (!courseEntry) {
    return next(new ApiError("Course not found for this student", 404));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ApiError("Course does not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: course,
  });
});
