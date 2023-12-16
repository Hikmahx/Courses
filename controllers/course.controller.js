const CourseModel = require("../models/Course.model");
const { validationResult } = require("express-validator");

// @route    GET api/courses
// @desc     Get all courses
// @access   Public
const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// @route    GET api/courses/:id
// @desc     Get a course by ID
// @access   Public
const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ msg: "Course doesn't exist" });
    }
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// @route    GET api/courses/search/:description
// @desc     Search for courses by description (partial match)
// @access   Public
const searchCoursesByDescription = async (req, res) => {
  const { desc } = req.query;

  try {
    const courses = await CourseModel.find({
      description: { $regex: desc, $options: "i" },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// @route    POST api/courses
// @desc     Create a new course
// @access   Private
const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subject, courseNumber, description } = req.body;

  try {
    // VALIDATE COURSE NUMBER FORMAT
    const courseNumberRegex = /^\d{3}$/;
    if (!courseNumberRegex.test(courseNumber)) {
      return res.status(400).json({
        msg: "course number must be a three-digit, zero-padded integer",
      });
    }

    // CHECK FOR DUPLICATE COURSES
    const existingCourse = await CourseModel.findOne({
      // USE A CASE-INSENSITIVE REGULAR EXPRESSION FOR SUBJECT COMPARISON
      subject: { $regex: new RegExp(`^${subject}$`, "i") },
      courseNumber,
    });
    if (existingCourse) {
      return res.status(400).json({ msg: "Course already exists" });
    }

    const newCourse = new CourseModel({
      subject,
      courseNumber,
      description,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// @route    PUT api/courses/:id
// @desc     Update a course by ID
// @access   Private
const updateCourse = async (req, res) => {
  const { subject, courseNumber, description } = req.body;

  try {
    // GET CURRENT COURSE DETAILS
    const currentCourse = await CourseModel.findById(req.params.id);
    if (!currentCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // CHECK FOR DUPLICATE COURSES ONLY IF SUBJECT OR COURSE NUMBER IS PROVIDED
    if (subject || courseNumber) {
      // QUERY FOR COURSE OTHER THAN THE CURRENT ONE
      const query = { _id: { $ne: req.params.id } };

      // IF SUBJECT IS PROVIDED, CHECK FOR DUPLICATES WITH THE SAME SUBJECT AND COURSENUMBER
      if (subject) {
        // CASE-INSENSITIVE REGEX
        query.subject = { $regex: new RegExp(subject, "i") };

        // CHECK IF UPDATED COURSENUMBER IS PROVIDED
        if (courseNumber) {
          query.courseNumber = courseNumber;
        } else {
          query.courseNumber = currentCourse.courseNumber;
        }
      }

      // IF COURSENUMBER IS PROVIDED, CHECK FOR DUPLICATES WITH THE SAME COURSENUMBER AND SUBJECT
      if (courseNumber) {
        // ENSURE IT IS A 3-DIGIT, ZERO PADDED INTEGER
        const courseNumberRegex = /^\d{3}$/;
        if (!courseNumberRegex.test(courseNumber)) {
          return res.status(400).json({
            msg: "course number must be a three-digit, zero-padded integer",
          });
        }

        query.courseNumber = courseNumber;

        // CHECK IF UPDATED SUBJECT IS PROVIDED
        if (subject) {
          // CASE-INSENSITIVE REGEX
          query.subject = { $regex: new RegExp(subject, "i") };
        } else {
          query.subject = currentCourse.subject;
        }
      }

      const existingCourse = await CourseModel.findOne(query);
      if (existingCourse) {
        return res.status(400).json({ msg: "Course already exists" });
      }
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      req.params.id,
      { subject, courseNumber, description },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// @route    DELETE api/courses/:id
// @desc     Delete a course by ID
// @access   Private
const deleteCourse = async (req, res) => {
  try {
    // FIND AND DELETE THE COURSE BY ID
    const course = await CourseModel.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(400).json({ msg: "Course doesn't exist" });
    }
    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ msg: "Course doesn't exist" });
    }
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  searchCoursesByDescription,
  createCourse,
  updateCourse,
  deleteCourse,
};
