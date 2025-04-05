// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Servir imágenes y archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));

// Fallback SPA frontend
app.get(/^\/(?!api|uploads|js|css|img).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/public/index.html'));
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));