const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    service: { 
        type: String, 
        required: true,
        trim: true // 🔹 Elimina espacios extra en el nombre del servicio
    },
    date: { 
        type: Date, // 📆 Se usa `Date` en lugar de `String` para evitar errores de formato
        required: true 
    },
    time: { 
        type: String, 
        required: true, 
        match: /^([01]\d|2[0-3]):([0-5]\d)$/, // ⏰ Validación de formato HH:MM
    }
}, { timestamps: true }); // 🕒 Agrega `createdAt` y `updatedAt` automáticamente

// 📌 Índice único para evitar reservas duplicadas en la misma fecha y hora
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;