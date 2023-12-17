const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  courseNumber: { type: String, required: true},
  description: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;
