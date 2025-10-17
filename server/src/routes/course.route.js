const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  deleteLecture,
  deleteCourse,
  updateCourse,
  getInstructorCourses,
  updateLecture,
  addLecture,
  getCoursesStudent,
} = require("../controllers/course.controller");
const { courseValidationRules } = require("../validations/courses.validator");
const protectAuth = require("../middleware/protectAuth.middleware");
const { updateCategoryValidator } = require("../validations/categoryValidator");

const router = express.Router();

// router.use(protectAuth);
//
router
  .route("/")
  .post(courseValidationRules, protectAuth, createCourse)
  .get(getCourses);

router
  .route("/:id")
  .get(getCourseById)
  .put(updateCategoryValidator, protectAuth, updateCourse)
  .delete(protectAuth, deleteCourse);

router.get("/instructor/my-courses", protectAuth, getInstructorCourses);
// router.get("/student/my-courses", getCoursesStudent);

router.post("/:courseId/lectures", protectAuth, addLecture);

router
  .route("/:courseId/lectures/:lectureId")
  .put(protectAuth, updateLecture)
  .delete(protectAuth, deleteLecture);

module.exports = router;
