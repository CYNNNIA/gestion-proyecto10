const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// **Registro de usuario**
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: '⚠️ Todos los campos son obligatorios.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: '⚠️ El correo ya está registrado.' });
        }

        const user = new User({ name, email, password, role }); // 👈 Guardamos el rol
        await user.save();

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role }, // 👈 Incluimos el rol en el token
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '✅ Registro exitoso. Redirigiendo...',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role } // 👈 Enviamos el rol
        });

    } catch (error) {
        console.error('❌ Error en el registro:', error);
        res.status(500).json({ message: '⚠️ Error en el servidor. Inténtalo más tarde.' });
    }
};

// **Login de usuario**
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: '⚠️ Por favor, ingresa email y contraseña.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '⚠️ Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '⚠️ Contraseña incorrecta.' });
        }

        // ✅ Generar token asegurando que incluya el `role`
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '✅ Inicio de sesión exitoso.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role  // ✅ Asegurar que el backend envía el rol correctamente
            }
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ message: '⚠️ Error en el servidor.' });
    }
};