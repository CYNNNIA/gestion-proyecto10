const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/Booking'); // Asegúrate de que este modelo exista

const router = express.Router();

// Obtener todas las reservas del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });
        res.json(bookings);
    } catch (error) {
        console.error("⚠️ Error al obtener reservas:", error);
        res.status(500).json({ message: 'Error al obtener reservas' });
    }
});

module.exports = router;