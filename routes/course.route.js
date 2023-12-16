const express = require("express");
const { body, validationResult } = require("express-validator");

const {
  getAllCourses,
  getCourseById,
  searchCoursesByDescription,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const router = express.Router();

// GET ALL COURSES
router.get("/", getAllCourses);

// SEARCH FOR COURSES BY DESCRIPTION
router.get("/search", searchCoursesByDescription);

// GET COURSE BY ID
router.get("/:id", getCourseById);

// CREATE NEW COURSE (INSTRUCTOR)
router.post(
  "/",
  [
    body("subject", "subject is required").not().isEmpty(),
    body("courseNumber", "course number is required").not().isEmpty(),
    body("description", "description is required").not().isEmpty(),
  ],
  createCourse
);

// UPDATE COURSE (INSTRUCTOR)
router.put("/:id", updateCourse);

// DELETE COURSE (INSTRUCTOR)
router.delete("/:id", deleteCourse);

module.exports = router;
