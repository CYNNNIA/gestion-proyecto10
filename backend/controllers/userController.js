const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

  
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    user = new User({ name, email, password: hashedPassword, role: role || 'cliente' });
    await user.save();


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Usuario registrado con éxito', token });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    res.json({ name: req.user.name, email: req.user.email, role: req.user.role });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};