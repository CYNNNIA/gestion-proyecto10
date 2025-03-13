const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔹 Registrar usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔍 Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 🔒 Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Crear el usuario con el rol adecuado (por defecto "cliente")
    user = new User({ name, email, password: hashedPassword, role: role || 'cliente' });
    await user.save();

    // 🎫 Crear token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Usuario registrado con éxito', token });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

// 🔹 Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Buscar usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // 🔒 Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // 🎫 Crear token JWT con datos del usuario
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};

// 🔹 Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Excluir la contraseña

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error obteniendo perfil:", error);
    res.status(500).json({ message: 'Error en el servidor al obtener el perfil' });
  }
};