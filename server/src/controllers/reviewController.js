const reviewModel = require("../models/reviewModel")
const asyncHandler = require("express-async-handler")


const createReview = asyncHandler(async (req, res) => {
    const {userId, courseId, rating, comment} = req.body
    const review = new reviewModel({userId, courseId, rating, comment})
    await review.save()
    res.status(201).json(review)
})


const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewModel.find().populate("userId").populate("courseId")
    res.json(reviews)
})


const getReviewById = asyncHandler(async (req, res) => {
    const review = await reviewModel.findById(req.params.id).populate("userId").populate("courseId")
    if(!review){
        return res.status(404).json({error: "Review not found"})
    }
    res.json(review)
})


const updateReview = asyncHandler(async (req, res) => {
    const review = await reviewModel.findByIdAndUpdate(req.params.id, req.body)
    if(!review){
        return res.status(404).json({error: "Review not found"})
    }
    res.json(review)
})


const deleteReview = asyncHandler(async (req, res) => {
    const review = await reviewModel.findByIdAndDelete(req.params.id)
    if(!review){
        return res.status(404).json({error: "Review not found"})
    }
    res.json({message: "Review deleted"})
})

module.exports = {createReview, getAllReviews, getReviewById, updateReview, deleteReview}