const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        console.log("➡️ Intentando crear una nueva reserva...");

        const { service, date, time } = req.body;
        const userId = req.user.id;

        if (!service || !date || !time) {
            return res.status(400).json({ message: "Faltan datos en la reserva." });
        }

        console.log(`📅 Verificando disponibilidad en ${date} a las ${time}...`);

        // ❌ No permitir reservas duplicadas en la misma fecha y hora
        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            console.log("🚫 Ya existe una reserva en esta fecha y hora.");
            return res.status(400).json({ message: "Ya hay una reserva en esta fecha y hora." });
        }

        // ⏳ Limitar máximo 5 reservas por día
        const bookingsCount = await Booking.countDocuments({ date });
        if (bookingsCount >= 5) {
            console.log("🚫 Se alcanzó el límite de reservas en este día.");
            return res.status(400).json({ message: "No se pueden hacer más reservas en esta fecha." });
        }

        // ✅ Crear la reserva
        const newBooking = new Booking({
            user: userId,
            service,
            date,
            time
        });

        await newBooking.save();
        console.log("✅ Reserva creada con éxito:", newBooking);
        res.status(201).json({ message: "Reserva creada con éxito.", booking: newBooking });

    } catch (error) {
        console.error("❌ Error creando la reserva:", error);
        res.status(500).json({ message: "Error creando la reserva." });
    }
};

// Obtener reservas del usuario autenticado
const getBookingsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`📋 Obteniendo reservas para el usuario ${userId}...`);

        // 🔍 Buscar reservas del usuario autenticado
        const bookings = await Booking.find({ user: userId }).populate('user', 'name email');

        console.log(`✅ ${bookings.length} reservas encontradas.`);
        res.json(bookings);
    } catch (error) {
        console.error("❌ Error obteniendo reservas:", error);
        res.status(500).json({ message: "Error obteniendo reservas." });
    }
};



// Obtener todas las reservas (solo admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error("❌ Error obteniendo todas las reservas:", error);
        res.status(500).json({ message: "Error obteniendo todas las reservas." });
    }
};

// Cancelar reserva
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Reserva no encontrada." });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta reserva." });
        }

        await booking.deleteOne();
        res.json({ message: "Reserva cancelada con éxito." });
    } catch (error) {
        console.error("❌ Error cancelando la reserva:", error);
        res.status(500).json({ message: "Error cancelando la reserva." });
    }
};

module.exports = { createBooking, getBookingsByUser, getAllBookings, cancelBooking };