const express = require('express');
const { createBooking, getBookingsByUser, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createBooking);
router.get('/user', authMiddleware, getBookingsByUser);
router.delete('/:id', authMiddleware, cancelBooking);

module.exports = router;