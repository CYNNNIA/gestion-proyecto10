const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Service',                        
    required: true
  },
  date: { 
    type: String 
  },
  time: { 
    type: String 
  },
  datetime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["activa", "cancelada"],
    default: "activa"
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;