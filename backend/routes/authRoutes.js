const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// **Registro de usuario**
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Validación de email en formato correcto
        const emailRegex = /.+\@.+\..+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Formato de correo inválido.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        // Crear usuario
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'Usuario registrado correctamente. Ahora puedes iniciar sesión.' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor. Inténtalo más tarde.' });
    }
});

// **Login de usuario**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ 
            message: 'Inicio de sesión exitoso.', 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor. Inténtalo más tarde.' });
    }
});

module.exports = router;