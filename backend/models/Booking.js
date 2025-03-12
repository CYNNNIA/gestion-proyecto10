const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;