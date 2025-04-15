
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe
} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);


router.get("/me", authMiddleware, getMe);

module.exports = router;