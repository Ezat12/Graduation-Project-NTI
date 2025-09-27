const express = require('express');
const {createCourse,getCourses,getCourseById, deleteLecture, deleteCourse, updateCourse} = require('../controllers/courseController');

const router = express.Router();

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.delete("/:courseId/lectures/:lectureId", deleteLecture);

module.exports = router;