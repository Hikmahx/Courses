const express = require("express");
const { body, validationResult } = require("express-validator");

const { getAllCourses, getCourseById, addCourse, deleteCourse } = require("../controllers/course.controller");

const router = express.Router();

// GET ALL COURSES
router.get("/", getAllCourses);

// GET COURSE BY ID
router.get("/:id", getCourseById);

// SEARCH FOR COURSES BY DESCRIPTION
router.get("/search/:description", searchCoursesByDescription);


// CREATE NEW COURSE (INSTRUCTOR)
router.post(
  "/",
  [
    body("subject", "subject is required").not().isEmpty(),
    body("courseNumber", "course number is required").not().isEmpty(),
    body("description", "description is required").not().isEmpty(),
  ],
  addCourse
);

// UPDATE COURSE (INSTRUCTOR)
router.put("/:id", updateCourse);

// DELETE COURSE (INSTRUCTOR)
router.delete("/:id", deleteCourse);

module.exports = router;