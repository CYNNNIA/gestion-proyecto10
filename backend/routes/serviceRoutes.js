const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createService, getServicesByProfessional, deleteService } = require('../controllers/serviceController');

// 📌 Ruta para crear un nuevo servicio
router.post('/create', authMiddleware, createService);

// 📌 Ruta para obtener los servicios del profesional autenticado
router.get('/my-services', authMiddleware, getServicesByProfessional);

// 📌 Ruta para eliminar un servicio
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;