// backend/controllers/availabilityController.js

const Availability = require("../models/Availability");

// ✅ Añadir disponibilidad
exports.addAvailability = async (req, res) => {
  try {
    const { dateTime } = req.body;

    if (!dateTime) {
      return res.status(400).json({ message: "⚠️ Debes proporcionar una fecha y hora." });
    }

    const newAvailability = new Availability({
      professional: req.user.id,
      dateTime,
    });

    await newAvailability.save();
    res.status(201).json({
      message: "✅ Disponibilidad guardada con éxito.",
      availability: newAvailability,
    });
  } catch (error) {
    console.error("❌ Error al guardar disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Obtener disponibilidad del profesional autenticado
exports.getAvailabilityByProfessional = async (req, res) => {
  try {
    const availability = await Availability.find({ professional: req.user.id });
    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Obtener TODA la disponibilidad (para mostrar al cliente)
exports.getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.find();
    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener toda la disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Obtener disponibilidad por ID de profesional (usada por clientes)
exports.getAvailabilityByProfessionalId = async (req, res) => {
  try {
    const { professionalId } = req.params;

    console.log("🔍 Buscando disponibilidad para ID de profesional:", professionalId);

    if (!professionalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "❌ ID de profesional no válido." });
    }

    const availability = await Availability.find({ professional: professionalId });

    if (!availability.length) {
      return res.status(404).json({ message: "⚠️ No hay disponibilidad para este profesional." });
    }

    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener disponibilidad por ID:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};