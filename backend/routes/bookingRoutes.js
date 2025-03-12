const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByUser, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para crear una reserva (requiere autenticación)
router.post('/create', authMiddleware, createBooking);

// 🔍 Ruta para obtener las reservas del usuario autenticado
router.get('/user', authMiddleware, getBookingsByUser);

// Ruta para obtener todas las reservas (solo admin)
router.get('/all', authMiddleware, getAllBookings);

// Ruta para cancelar una reserva
router.delete('/cancel/:id', authMiddleware, cancelBooking);

module.exports = router;