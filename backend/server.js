const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Importa path para servir archivos estáticos
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes'); // 📌 Nueva ruta para servicios

const app = express();
const PORT = process.env.PORT || 5002;

// ✅ Conectar a la base de datos
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Para leer JSON en el body

// ✅ Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes); // 📌 Ruta para la gestión de servicios

// ✅ Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('🚀 API funcionando correctamente');
});

// ✅ Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://127.0.0.1:${PORT}`);
});