const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    courses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.StudentCourse ||
  mongoose.model("StudentCourse", studentCourseSchema);
