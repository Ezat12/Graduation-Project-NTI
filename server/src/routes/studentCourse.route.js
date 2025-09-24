const express = require("express");
const router = express.Router();

const {
  addCourseToStudent,
  getStudentCourses,
  removeStudentFromCourse,
} = require("../controllers/studentCourse.controller");
const {
  addStudentCourseValidator,
  removeStudentCourseValidator,
} = require("../validations/studentCourseValidation");
const protectAuth = require("../middleware/protectAuth.middleware");

router.use(protectAuth);

router.post("/:courseId", addStudentCourseValidator, addCourseToStudent);
router.get("/", getStudentCourses);
router.delete("/", removeStudentCourseValidator, removeStudentFromCourse);

module.exports = router;
