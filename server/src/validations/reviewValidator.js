const {body} = require("express-validator")

createReviewValidator = [
    body("userId").notEmpty().withMessage("userId is required").isMongoId().withMessage("userId must be a valid Mongo ID"),

    body("courseId").notEmpty().withMessage("courseId is required").isMongoId().withMessage("courseId must be a valid Mongo ID"),

    body("rating").notEmpty().withMessage("rating is required").isInt({min: 1, max: 5}).withMessage("rating must be between 1 and 5"),

    body("comment").optional().isString().withMessage("comment must be a string").isLength({max: 500}).withMessage("comment cannot exceed 500 charecters")
]

module.exports = createReviewValidator