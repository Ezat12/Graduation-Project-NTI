const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [4, "title must be greater than 4 char"],
  },
  freePreview: {
    type: Boolean,
    required: [true, "free preview required"],
  },
  public_id: String,
  videoUrl: {
    type: String,
    required: [true, "video is required"],
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    instructorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "instructor is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "image is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "category is required"],
      },
    ],
    language: {
      type: [String],
      enum: ["English", "Arabic", "French", "Spanish"],
      default: ["English"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All levels"],
      required: [true, "level is required"],
    },
    objective: [String],
    lectures: [lectureSchema],
    enrollments: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating must be at most 5"],
      default: 0,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
