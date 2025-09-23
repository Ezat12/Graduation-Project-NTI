const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User', 
      required: true
    },
    courses: {
      type: [String],
      ref: 'Course',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentCourse", studentCourseSchema);
