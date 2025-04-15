const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email no válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["cliente", "profesional"],
      required: [true, "El rol es obligatorio"],
    },
    avatar: {
      type: String,
      default: "", // opcional si decides permitir avatares en el futuro
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);