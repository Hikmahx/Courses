const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { verifyTokenAndAdmin } = require("../middlewares/auth.middleware");
const dotenv = require("dotenv");
const { registerUser, getUserById } = require("../controllers/user.controller");
dotenv.config({ path: "../config/config.env" });

// GET REGISTERED USER BY ID (ADMIN)
router.get("/find/:id", verifyTokenAndAdmin, getUserById);

// REGISTER USER
router.post(
  "/",
  body("username", "Please enter a username").not().isEmpty(),
  body("email", "Please include a valid email").isEmail(),
  body(
    "password",
    "Please password shouldnt be less than 6 characters"
  ).isLength({ min: 5 }),
  body("role", "Invalid role").optional().isIn(["student", "instructor", "admin"]),
  registerUser
);

module.exports = router;