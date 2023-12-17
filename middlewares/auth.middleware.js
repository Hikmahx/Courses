const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });


const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded == "string") {
      throw new Error("Invalid token");
    }
    req.user = {
      id: decoded.user.id,
      role: decoded.user.role,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Token is not valid" });
  }
};

// TO CHECK IF THE USER IS THE ONE MAKING THE REQUEST
const verifyTokenAndUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.status(403).json({ message: "You're not allowed to do that!" });
    }
  });
};

// VERIFY IF THE USER IS AN ADMIN
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    try {
      if (req.user.role != "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  });
};

// VERIFY IF THE USER IS AN INSTRUCTOR
const verifyTokenAndInstructor = (req, res, next) => {
  verifyToken(req, res, () => {
    try {
      if (req.user.role != "instructor") {
        return res.status(403).json({ message: "Access denied. User is not an instructor" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndAdmin,
  verifyTokenAndInstructor
}

