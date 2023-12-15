const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  courseNumber: { type: String, required: true},
  description: { type: String, required: true },
});

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;
