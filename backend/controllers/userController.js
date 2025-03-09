const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: 'El usuario ya existe' });

    user = new User({ name, email, password });
    await user.save();

    // Crear token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Usuario registrado con éxito', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Crear token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};