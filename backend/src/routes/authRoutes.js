const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createUser,
  loginUser
} = require("../controllers/userController");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many authentication attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/register", authLimiter, createUser);
router.post("/login", authLimiter, loginUser);

router.post("/logout", (req, res) => {
  res.json({
    message: "Logout successful. Please remove the token from the client."
  });
});

module.exports = router;