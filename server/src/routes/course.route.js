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
} = require("../controllers/course.controller");
const { courseValidationRules } = require("../validations/courses.validator");
const protectAuth = require("../middleware/protectAuth.middleware");
const { updateCategoryValidator } = require("../validations/categoryValidator");

const router = express.Router();

router.use(protectAuth);

router.route("/").post(courseValidationRules, createCourse).get(getCourses);

router
  .route("/:id")
  .get(getCourseById)
  .put(updateCategoryValidator, updateCourse)
  .delete(deleteCourse);

router.get("/instructor/my-courses", getInstructorCourses);

router.post("/:courseId/lectures", addLecture);

router
  .route("/:courseId/lectures/:lectureId")
  .put(updateLecture)
  .delete(deleteLecture);

module.exports = router;
