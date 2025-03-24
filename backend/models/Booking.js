const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId,  // <-- CAMBIADO
    ref: 'Service',                        // <-- CAMBIADO
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true, 
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  }
}, { timestamps: true });

bookingSchema.index({ date: 1, time: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;