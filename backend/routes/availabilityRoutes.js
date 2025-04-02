// backend/routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addAvailability,
  getAvailabilityByProfessional,
  getAllAvailability,
  getAvailabilityByProfessionalId
} = require("../controllers/availabilityController");

// Todas las rutas necesarias:
router.get("/all", getAllAvailability); // público
router.post("/add", auth, addAvailability); // profesional logueado
router.get("/my-availability", auth, getAvailabilityByProfessional); // profesional logueado
router.get("/professional/:professionalId", getAvailabilityByProfessionalId); // 🟢 cliente

module.exports = router;