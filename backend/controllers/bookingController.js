const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const { service, date, time } = req.body;
        const userId = req.user.id;

        // Verificar si ya hay una reserva en la misma fecha y hora
        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            return res.status(400).json({ message: "Ya hay una reserva en esta fecha y hora." });
        }

        const newBooking = new Booking({
            user: userId,
            service,
            date,
            time
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: "Error creando la reserva", error });
    }
};

const getBookingsByUser = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo reservas", error });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo todas las reservas", error });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Reserva no encontrada." });
        }

        // Verificar si la reserva pertenece al usuario o si es admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta reserva." });
        }

        await booking.deleteOne();
        res.json({ message: "Reserva cancelada con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error cancelando la reserva", error });
    }
};

module.exports = { createBooking, getBookingsByUser, getAllBookings, cancelBooking };