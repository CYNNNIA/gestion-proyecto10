// backend/routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addAvailability,
  getAvailabilityByProfessional,
  getAllAvailability,
  getAvailabilityByProfessionalId,
  getAvailabilityByServiceId, // ✅ añadido
} = require("../controllers/availabilityController");

// Rutas
router.get("/all", getAllAvailability); // público
router.post("/add", auth, addAvailability); // profesional logueado
router.get("/my-availability", auth, getAvailabilityByProfessional); // profesional logueado
router.get("/professional/:professionalId", getAvailabilityByProfessionalId); // cliente
router.get("/service/:serviceId", getAvailabilityByServiceId); // ✅ nueva ruta

module.exports = router;
