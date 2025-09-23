const express= require('express');
const router= express.Router();

const{addStudentCourse,getStudentCourses,removeStudentFromCourse}= require('../controllers/studentCourseController');

const { validateBody } = require("../middleware/validate");
const {addSchema,removeSchema}= require('../validations/studentCourseValidation');

router.post('/',validateBody(addSchema), addStudentCourse);
router.get('/', getStudentCourses);
router.delete('/', validateBody(removeSchema), removeStudentFromCourse);

module.exports= router;