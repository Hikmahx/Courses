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

const {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndAdmin,
  verifyTokenAndInstructor,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// GET ALL COURSES (PUBLIC ACCESS)
router.get("/", getAllCourses);

// SEARCH FOR COURSES BY DESCRIPTION (PUBLIC ACCESS)
router.get("/search", searchCoursesByDescription);

// GET COURSE BY ID (PUBLIC ACCESS)
router.get("/:id", getCourseById);

// CREATE NEW COURSE (INSTRUCTOR ONLY)
router.post(
  "/",
  [
    body("subject", "subject is required").not().isEmpty(),
    body("courseNumber", "course number is required").not().isEmpty(),
    body("description", "description is required").not().isEmpty(),
  ],
  verifyTokenAndInstructor,
  createCourse
);

// UPDATE COURSE (INSTRUCTOR ONLY, CAN ONLY UPDATE THEIR OWN COURSES)
router.put("/:id", verifyTokenAndInstructor, updateCourse);

// DELETE COURSE (INSTRUCTOR ONLY, CAN ONLY DELETE THEIR OWN COURSES)
router.delete(
  "/:id",
  verifyTokenAndInstructor,
  deleteCourse
);

module.exports = router;
