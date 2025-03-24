const Availability = require("../models/Availability");

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
    res.status(201).json({ message: "✅ Disponibilidad guardada con éxito.", availability: newAvailability });
  } catch (error) {
    console.error("❌ Error al guardar disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

exports.getAvailabilityByProfessional = async (req, res) => {
  try {
    const availability = await Availability.find({ professional: req.user.id });
    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};
exports.getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.find();
    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener toda la disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};