const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 📌 REGISTRO: con retorno automático del token
exports.registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    const role = req.body.role;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // 🟢 Login automático tras registro
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en el registro:", err);
    res.status(500).json({ message: "Error del servidor." });
  }
};

// 📌 LOGIN: Validación y token si es correcto
exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuario no encontrado:", email);
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta para:", email);
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ message: "Error del servidor." });
  }
};

// 📌 PERFIL PRIVADO (Get Me)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error obteniendo perfil:", err);
    res.status(500).json({ message: "Error del servidor." });
  }
};