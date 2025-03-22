const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createService, getAllServices, getServicesByProfessional, deleteService } = require('../controllers/serviceController');

// 📌 Ruta para obtener todos los servicios
router.get('/', getAllServices);

// 📌 Ruta para obtener los servicios de un profesional específico
router.get('/my-services', authMiddleware, getServicesByProfessional);

// 📌 Ruta para crear un nuevo servicio (solo profesionales autenticados)
router.post('/create', authMiddleware, createService);

// 📌 Ruta para eliminar un servicio (solo el profesional que lo creó puede hacerlo)
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;