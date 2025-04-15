const Availability = require("../models/Availability");


exports.addAvailability = async (req, res) => {
  try {
    const { dateTime, service } = req.body;

    if (!dateTime || !service) {
      return res.status(400).json({ message: "⚠️ Fecha y servicio requeridos." });
    }

    const newAvailability = new Availability({
      professional: req.user.id,
      service,
      dateTime: new Date(dateTime), 
    });

    await newAvailability.save();
    res.status(201).json({
      message: "✅ Disponibilidad creada",
      availability: newAvailability,
    });
  } catch (error) {
    console.error("❌ Error al guardar disponibilidad:", error);
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


exports.getAvailabilityByProfessional = async (req, res) => {
  try {
    const availability = await Availability.find({ professional: req.user.id });
    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener disponibilidad:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};


exports.getAvailabilityByProfessionalId = async (req, res) => {
  try {
    const { professionalId } = req.params;

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


exports.getAvailabilityByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "❌ ID de servicio no válido." });
    }

    const availability = await Availability.find({ service: serviceId });
    res.json(availability);
  } catch (error) {
    console.error("❌ Error al obtener disponibilidad por servicio:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};