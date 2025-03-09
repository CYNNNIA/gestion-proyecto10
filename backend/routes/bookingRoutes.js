const express = require('express');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.put('/:bookingId', authMiddleware, cancelBooking);

module.exports = router;