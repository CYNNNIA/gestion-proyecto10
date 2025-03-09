const Booking = require('../models/Booking');

// Crear una reserva
exports.createBooking = async (req, res) => {
  try {
    const { date, serviceType } = req.body;
    const userId = req.user.id;

    const newBooking = new Booking({ user: userId, date, serviceType });
    await newBooking.save();

    res.status(201).json({ message: 'Reserva creada con éxito', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todas las reservas del usuario
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Cancelar una reserva
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

    booking.status = 'cancelado';
    await booking.save();

    res.json({ message: 'Reserva cancelada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};