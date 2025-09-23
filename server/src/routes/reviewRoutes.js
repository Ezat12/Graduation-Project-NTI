const express = require("express")
const router = express.Router()
const {createReview, getAllReviews, getReviewById, updateReview, deleteReview} = require("../controllers/reviewController")
const validate = require("../middleware/validatorMiddleware")
const createReviewValidator = require("../validations/reviewValidator")

router.post("/", createReviewValidator, validate, createReview)

router.get("/", getAllReviews)
router.get("/:id", getReviewById)

router.put("/:id", createReviewValidator, validate, updateReview)

router.delete("/:id", deleteReview)

module.exports = router