const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se envíen los datos requeridos
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, ingresa email y contraseña' });
        }

        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token seguro
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Enviar el token en la respuesta junto con datos básicos del usuario
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};