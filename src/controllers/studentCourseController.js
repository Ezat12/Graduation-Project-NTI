const asyncHandler = require('express-async-handler');
const StudentCourse = require('../models/studentCourse');
const hide = require('../utils/index');
const Course = require("../models/course"); // 👈 ده كفاية

exports.addStudentCourse = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id || req.body.userId; // ✅ نخليها userId بس لو مش عايز JWT
  const courses = req.body.courses;

  if (!userId) throw new hide("userId is required", 400);

  let sc = await StudentCourse.findOne({ userId });
  if (!sc) {
    sc = await StudentCourse.create({ userId, courses });
  } else {
    for (const courseId of courses) {
      if (!sc.courses.includes(courseId)) {
        sc.courses.push(courseId);
      }
    }
    await sc.save();
  }

  sc = await StudentCourse.findById(sc._id).populate('courses');
  return res.status(200).json({
    message: 'Student courses added/updated successfully',
    data: sc,
  });
});

exports.getStudentCourses = asyncHandler(async (req, res, next) => {

  const sc = await StudentCourse.find().populate('courses');

  if (!sc || sc.length === 0) {
    throw new hide('No students found', 404);
  }

  return res.status(200).json(sc); 
});



exports.removeStudentFromCourse = asyncHandler(async (req, res, next) => {
  const userId = req.body.userId || req.user?.id;
  const courseId = req.body.courseId;

  if (!userId || !courseId)
    throw new hide('User ID and Course ID are required', 400);

  const sc = await StudentCourse.findOne({ userId });
  if (!sc) throw new hide('Student not found', 404);

  sc.courses = sc.courses.filter(cId => cId.toString() !== courseId);
  await sc.save();

  const populate = await StudentCourse.findById(sc._id).populate('courses');

  return res.status(200).json({
    message: 'Course removed from student successfully',
    data: populate,
  });
});
