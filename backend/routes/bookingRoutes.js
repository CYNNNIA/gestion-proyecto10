// backend/routes/bookingRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookingsByUser,
  cancelBooking,
  getAllBookings,
  getBookingsForProfessional // ✅ Nuevo controlador para profesionales
} = require("../controllers/bookingController");

// Crear una nueva reserva
router.post("/create", auth, createBooking);

// Obtener reservas del usuario autenticado
router.get("/user", auth, getBookingsByUser);

// Obtener reservas para el profesional autenticado
router.get("/professional", auth, getBookingsForProfessional);

// Cancelar una reserva
router.delete("/:id", auth, cancelBooking);

// Obtener todas las reservas (solo admin)
router.get("/all", auth, getAllBookings);

module.exports = router;
