const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "El nombre es obligatorio"] },
  email: { 
    type: String, 
    required: [true, "El correo electrónico es obligatorio"], 
    unique: true,
    match: [/.+\@.+\..+/, "Por favor, introduce un correo válido"]
  },
  password: { type: String, required: [true, "La contraseña es obligatoria"], minlength: 6 },
  role: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
  if (!password) return false;
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);