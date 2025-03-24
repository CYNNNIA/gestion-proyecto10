const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addAvailability,
  getAvailabilityByProfessional,
  getAllAvailability,
} = require("../controllers/availabilityController");

// Obtener TODA la disponibilidad (para el cliente)
router.get("/all", getAllAvailability);

// Añadir disponibilidad (profesional)
router.post("/add", auth, addAvailability);

// Obtener disponibilidad del profesional logueado
router.get("/my-availability", auth, getAvailabilityByProfessional);

module.exports = router;