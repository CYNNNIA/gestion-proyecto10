const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        console.log("➡️ Intentando crear una nueva reserva...");
        console.log("📥 Datos recibidos:", req.body);

        const { service, date, time } = req.body;
        if (!service || !date || !time) {
            console.log("🚨 Faltan datos en la reserva.");
            return res.status(400).json({ message: "Faltan datos en la reserva." });
        }

        console.log(`📅 Verificando disponibilidad en ${date} a las ${time}...`);

        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            console.log("🚫 Ya existe una reserva en esta fecha y hora.");
            return res.status(400).json({ message: "Ya hay una reserva en esta fecha y hora." });
        }

        const newBooking = new Booking({
            user: req.user.id, 
            service,
            date,
            time
        });

        await newBooking.save();
        console.log("✅ Reserva creada con éxito:", newBooking);
        res.status(201).json({ message: "Reserva creada con éxito.", booking: newBooking });

    } catch (error) {
        console.error("❌ Error creando la reserva:", error);
        res.status(500).json({ message: "Error en el servidor al crear la reserva." });
    }
};

// Obtener reservas del usuario autenticado
const getBookingsByUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "No autorizado." });
        }

        const userId = req.user.id;
        console.log(`📋 Obteniendo reservas para el usuario ${userId}...`);

        // 🔍 Buscar reservas del usuario autenticado
        const bookings = await Booking.find({ user: userId }).populate('user', 'name email');

        console.log(`✅ ${bookings.length} reservas encontradas.`);
        res.json(bookings);
    } catch (error) {
        console.error("❌ Error obteniendo reservas:", error);
        res.status(500).json({ message: "Error en el servidor al obtener las reservas." });
    }
};

// Obtener todas las reservas (solo admin)
const getAllBookings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acceso denegado." });
        }

        const bookings = await Booking.find().populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error("❌ Error obteniendo todas las reservas:", error);
        res.status(500).json({ message: "Error en el servidor al obtener las reservas." });
    }
};

// Cancelar reserva
const cancelBooking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "No autorizado." });
        }

        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Reserva no encontrada." });
        }

        // Solo el usuario creador o un admin pueden cancelar
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta reserva." });
        }

        await booking.deleteOne();
        res.json({ message: "Reserva cancelada con éxito." });
    } catch (error) {
        console.error("❌ Error cancelando la reserva:", error);
        res.status(500).json({ message: "Error en el servidor al cancelar la reserva." });
    }
};

module.exports = { createBooking, getBookingsByUser, getAllBookings, cancelBooking };