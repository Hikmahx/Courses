const express = require("express");
const { body } = require("express-validator");
const {
  authenticateUser,
  deleteUser,
  getLoggedInUser,
  updateUser,
} = require("../controllers/auth.controller");
const { verifyToken, verifyTokenAndUser } = require("../middlewares/auth.middleware");

const router = express.Router();

// GET LOGGED IN USER
router.get("/", verifyToken, getLoggedInUser);

// AUTHENTICATE USER AND GET TOKEN
router.post(
  "/",
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
  authenticateUser
);

// UPDATE USER
router.put("/:id", verifyTokenAndUser, updateUser);

// DELETE USER
router.delete("/:id", verifyTokenAndUser, deleteUser);

module.exports = router;