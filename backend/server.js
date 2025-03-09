require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch((err) => console.error('🔴 Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

// Servidor
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));