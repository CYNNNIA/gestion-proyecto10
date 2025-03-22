const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ['Belleza', 'Fitness', 'Educación', 'Tecnología', 'Salud'], // ✅ Categoría "Salud" agregada
        required: true 
    },
    availableDates: { type: [Date], required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Service', serviceSchema);