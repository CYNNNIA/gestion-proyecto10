// backend/controllers/bookingController.js

const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Availability = require('../models/Availability');

// ✅ Crear reserva
const createBooking = async (req, res) => {
  try {
    const { service, date, time } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "⚠️ No autorizado." });
    }

    if (!service || !date || !time) {
      return res.status(400).json({ message: "⚠️ Todos los campos son obligatorios." });
    }

    const selectedService = await Service.findById(service);
    if (!selectedService) {
      return res.status(404).json({ message: "⚠️ Servicio no encontrado." });
    }

    const dateTimeToCheck = new Date(`${date}T${time}`);

    const isAvailable = await Availability.findOne({
      professional: selectedService.professional,
      dateTime: dateTimeToCheck,
    });

    if (!isAvailable) {
      return res.status(400).json({
        message: "⚠️ Este servicio no está disponible en la fecha y hora seleccionadas.",
      });
    }

    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(400).json({
        message: "⚠️ Ya hay una reserva en esa fecha y hora.",
      });
    }

    const newBooking = new Booking({
      user: req.user.id,
      service,
      date,
      time,
    });

    await newBooking.save();

    res.status(201).json({
      message: "✅ Reserva creada con éxito.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Error creando reserva:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Obtener reservas del usuario autenticado
const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("service");
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo reservas:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Obtener todas las reservas (admin)
const getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "⚠️ Acceso denegado." });
    }

    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name');
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo todas las reservas:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Obtener reservas para el profesional autenticado
const getBookingsForProfessional = async (req, res) => {
  try {
    const services = await Service.find({ professional: req.user.id });
    const serviceIds = services.map(s => s._id);

    const bookings = await Booking.find({ service: { $in: serviceIds } })
      .populate('user', 'name email')
      .populate('service', 'name');

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo reservas del profesional:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

// ✅ Cancelar reserva
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "⚠️ Reserva no encontrada." });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "⚠️ No tienes permiso para cancelar esta reserva." });
    }

    await booking.deleteOne();
    res.json({ message: "✅ Reserva cancelada con éxito." });
  } catch (error) {
    console.error("❌ Error cancelando la reserva:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  cancelBooking,
  getBookingsForProfessional,
};