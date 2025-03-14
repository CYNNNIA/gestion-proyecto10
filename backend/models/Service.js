const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el profesional que ofrece el servicio
    availableDates: [{ type: Date, required: true }], // Fechas disponibles
    category: { type: String, required: true, enum: ['masaje', 'entrenamiento', 'nutrición', 'terapia', 'otros'] },
    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;