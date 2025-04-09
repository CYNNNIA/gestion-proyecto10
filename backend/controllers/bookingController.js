// backend/controllers/bookingController.js

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Availability = require("../models/Availability");

// Crear reserva
const createBooking = async (req, res) => {
  try {
    const { service, datetime } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "⚠️ No autorizado." });
    }

    if (!service || !datetime) {
      return res.status(400).json({ message: "⚠️ Todos los campos son obligatorios." });
    }

    const selectedService = await Service.findById(service);
    if (!selectedService) {
      return res.status(404).json({ message: "⚠️ Servicio no encontrado." });
    }

    const dateTimeToCheck = new Date(datetime);
    if (isNaN(dateTimeToCheck)) {
      return res.status(400).json({ message: "⚠️ Fecha y hora inválidas." });
    }

    if (dateTimeToCheck < new Date()) {
      return res.status(400).json({ message: "⚠️ No puedes reservar en el pasado." });
    }

    const isAvailable = await Availability.findOne({
      professional: selectedService.professional,
      service,
      dateTime: dateTimeToCheck,
    });

    if (!isAvailable) {
      return res.status(400).json({
        message: "⚠️ Este servicio no está disponible en la fecha y hora seleccionadas.",
      });
    }

    const date = dateTimeToCheck.toISOString().split("T")[0];
    const time = dateTimeToCheck.toTimeString().slice(0, 5);

    const existingBooking = await Booking.findOne({ service, date, time });
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
    await Availability.findByIdAndDelete(isAvailable._id);

    res.status(201).json({ message: "✅ Reserva creada con éxito.", booking: newBooking });
  } catch (error) {
    console.error("❌ Error creando reserva:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service")
      .populate("user", "name email");
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo reservas:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "⚠️ Acceso denegado." });
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("service", "name");
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo todas las reservas:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

const getBookingsForProfessional = async (req, res) => {
  try {
    const services = await Service.find({ professional: req.user.id });
    const serviceIds = services.map((s) => s._id);

    const bookings = await Booking.find({ service: { $in: serviceIds } })
      .populate("user", "name email")
      .populate("service", "name");

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo reservas del profesional:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

const getBookingsByService = async (req, res) => {
  try {
    const bookings = await Booking.find({ service: req.params.serviceId });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error obteniendo reservas por servicio:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "⚠️ Reserva no encontrada." });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "⚠️ No tienes permiso para cancelar esta reserva." });
    }

    // ✅ Restaurar disponibilidad al cancelar
    const service = await Service.findById(booking.service);
    const restoredDateTime = new Date(`${booking.date}T${booking.time}`);

    if (!isNaN(restoredDateTime.getTime())) {
      await Availability.create({
        professional: service.professional,
        service: booking.service,
        dateTime: restoredDateTime,
      });
    }

    await booking.deleteOne();
    res.json({ message: "✅ Reserva cancelada con éxito." });
  } catch (error) {
    console.error("❌ Error cancelando la reserva:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { datetime } = req.body;

    if (!datetime) return res.status(400).json({ message: "⚠️ Falta nueva fecha/hora." });

    const newDateTime = new Date(datetime);
    if (isNaN(newDateTime)) return res.status(400).json({ message: "⚠️ Fecha/hora inválidas." });

    if (newDateTime < new Date()) return res.status(400).json({ message: "⚠️ Fecha pasada." });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "⚠️ Reserva no encontrada." });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "⚠️ No autorizado." });
    }

    const service = await Service.findById(booking.service);

    const available = await Availability.findOne({
      service: booking.service,
      professional: service.professional,
      dateTime: newDateTime,
    });

    if (!available) {
      return res.status(400).json({ message: "⚠️ Fecha nueva no disponible." });
    }

    await Availability.create({
      service: booking.service,
      professional: service.professional,
      dateTime: new Date(`${booking.date}T${booking.time}`),
    });

    await Availability.findByIdAndDelete(available._id);

    booking.date = newDateTime.toISOString().split("T")[0];
    booking.time = newDateTime.toTimeString().slice(0, 5);
    await booking.save();

    res.json({ message: "✅ Reserva actualizada.", booking });
  } catch (error) {
    console.error("❌ Error al actualizar reserva:", error);
    res.status(500).json({ message: "⚠️ Error del servidor." });
  }
};

module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  cancelBooking,
  getBookingsForProfessional,
  updateBooking,
  getBookingsByService,
};
