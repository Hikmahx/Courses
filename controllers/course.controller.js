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
  const { description } = req.params;

  try {
    const courses = await CourseModel.find({ description: { $regex: description, $options: 'i' } });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


// // @route    POST api/courses
// // @desc     Add a new course
// // @access   Public
//  const addCourse = async (req, res) => {
//   // VALIDATE THE REQUEST BODY
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { subject, courseNumber, description } = req.body;

//   try {
//     // CHECK IF THE COURSE ALREADY EXISTS
//     let course = await CourseModel.findOne({ subject, courseNumber });
//     if (course) {
//       return res.status(400).json({ msg: "Course already exist" });
//     }

//     // CREATE A NEW COURSE
//     course = new CourseModel({
//       subject,
//       courseNumber,
//       description,
//     });

//     // SAVE THE COURSE TO THE DATABASE
//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// };

// const createCourse = (req, res) => {
//   const { subject, courseNumber, description } = req.body;

//   // Validate courseNumber format
//   if (!/^\d{3}$/.test(courseNumber)) {
//     return res.status(400).json({ message: 'Invalid courseNumber format' });
//   }

//   // Check for duplicate courses
//   const isDuplicate = courses.some(
//     (c) => c.subject === subject && c.courseNumber === courseNumber
//   );

//   if (isDuplicate) {
//     return res.status(400).json({ message: 'Duplicate course found' });
//   }

//   const newCourse = {
//     id: courses.length + 1,
//     subject,
//     courseNumber,
//     description,
//   };

//   courses.push(newCourse);
//   res.status(201).json(newCourse);
// };

// // @route    PUT api/courses/:id
// // @desc     Update a course by ID
// // @access   Public
//  const updateCourse = async (req, res) => {
//   // EXTRACT DATA FROM THE REQUEST BODY
//   const { subject, courseNumber, description } = req.body;

//   try {
//     // FIND THE COURSE BY ID
//     let course = await CourseModel.findById(req.params.id);
//     if (!course) {
//       return res.status(400).json({ msg: "Course doesn't exist" });
//     }

//     // UPDATE THE COURSE PROPERTIES
//     course.subject = subject;
//     course.courseNumber = courseNumber;
//     course.description = description;

//     // SAVE THE UPDATED COURSE TO THE DATABASE
//     await course.save();
//     res.status(200).json(course);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ msg: "Course doesn't exist" });
//     }
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// };

// @route    POST api/courses
// @desc     Create a new course
// @access   Private
const addCourse = async (req, res) => {
  const { subject, courseNumber, description } = req.body;

  try {
    // VALIDATE COURSE NUMBER FORMAT
    const courseNumberRegex = /^\d{3}$/;
    if (!courseNumberRegex.test(courseNumber)) {
      return res.status(400).json({ msg: 'courseNumber must be a three-digit, zero-padded integer' });
    }

    // CHECK FOR DUPLICATE COURSES
    const existingCourse = await CourseModel.findOne({ subject, courseNumber });
    if (existingCourse) {
      return res.status(400).json({ msg: 'Course already exists' });
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
    // VALIDATE COURSE NUMBER FORMAT
    const courseNumberRegex = /^\d{3}$/;
    if (!courseNumberRegex.test(courseNumber)) {
      return res.status(400).json({ msg: 'courseNumber must be a three-digit, zero-padded integer' });
    }

    // CHECK FOR DUPLICATE COURSES
    const existingCourse = await CourseModel.findOne({ subject, courseNumber });
    if (existingCourse && existingCourse._id.toString() !== req.params.id) {
      return res.status(400).json({ msg: 'Course already exists' });
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      req.params.id,
      { subject, courseNumber, description },
      { new: true } 
    );

    if (!updatedCourse) {
      return res.status(404).json({ msg: 'Course not found' });
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
  addCourse,
  updateCourse,
  deleteCourse,
}
