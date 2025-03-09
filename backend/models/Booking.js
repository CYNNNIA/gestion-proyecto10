const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  serviceType: { type: String, required: true, enum: ['Maquillaje de día', 'Maquillaje de noche', 'Boda', 'Fiesta'] },
  status: { type: String, enum: ['pendiente', 'confirmado', 'cancelado'], default: 'pendiente' }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;