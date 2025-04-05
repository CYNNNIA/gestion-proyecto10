// backend/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createBooking,
  getBookingsByUser,
  cancelBooking,
  getAllBookings,
  getBookingsForProfessional,
  updateBooking, // ⬅️ Asegúrate de importar esta función
} = require("../controllers/bookingController");

// Rutas existentes
router.post("/create", auth, createBooking);
router.get("/user", auth, getBookingsByUser);
router.get("/professional", auth, getBookingsForProfessional);
router.get("/all", auth, getAllBookings); // si es admin
router.delete("/:id", auth, cancelBooking);

// ⬅️ Añade esta nueva ruta
router.put("/:id", auth, updateBooking);

module.exports = router;