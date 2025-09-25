const asyncHandler = require("express-async-handler");
const StudentCourse = require("../models/studentCourse");
const hide = require("../utils/index");

exports.addCourseToStudent = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user._id;
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
  return studentCourse;
});

exports.getStudentCourses = asyncHandler(async (req, res, next) => {
  const sc = await StudentCourse.find().populate("courses");

  if (!sc || sc.length === 0) {
    throw new hide("No students found", 404);
  }

  return res.status(200).json(sc);
});

exports.removeStudentFromCourse = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const courseId = req.params.courseId;

  if (!userId || !courseId) {
    return next(new new ApiError("User ID and Course ID are required", 400)());
  }

  const sc = await StudentCourse.findOne({ userId });
  if (!sc) {
    return next(new new ApiError("Not found courses to student", 404)());
  }

  const exists = sc.courses.some((cId) => cId.toString() === courseId);
  if (!exists) {
    return next(new ApiError("Course not found for this student", 404));
  }

  sc.courses = sc.courses.filter((cId) => cId.toString() !== courseId);
  await sc.save();

  const coursesStudent = await StudentCourse.findById(sc._id).populate(
    "courses"
  );

  return res.status(200).json({
    message: "Course removed from student successfully",
    data: coursesStudent,
  });
});
