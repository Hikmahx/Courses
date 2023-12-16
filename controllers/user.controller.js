
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/config.env" });

// @route    GET api/user/find/:id
// @desc     Get registered user by ID
// @access   Private (Admin)
 const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route    POST api/user
// @desc     Register user
// @access   Public
 const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, username, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).send("User already exists");
    }

    // CREATE A NEW USER
    user = new User({
      firstname,
      lastname,
      username,
      email,
      password,
      role: role || "student",
    });

    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getUserById,
  registerUser,
}