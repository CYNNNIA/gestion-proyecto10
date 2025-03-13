const express = require('express');
const { register, login, getProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Ruta para registrar un usuario
router.post('/register', register);

// ✅ Ruta para iniciar sesión
router.post('/login', login);

// 🔍 Ruta para obtener el perfil del usuario autenticado
router.get('/profile', authMiddleware, getProfile);

module.exports = router;