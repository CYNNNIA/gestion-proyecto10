// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe
} = require("../controllers/authController");

// Registro y login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Obtener perfil del usuario autenticado
router.get("/me", authMiddleware, getMe);

module.exports = router;