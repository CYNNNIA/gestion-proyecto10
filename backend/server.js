require('dotenv').config(); // 📌 Cargar variables del .env
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // 💡 Asegúrate de que está importado

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Definir rutas correctamente
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes); // 💡 Asegúrate de que esta línea está presente

app.get('/', (req, res) => {
  res.send('🚀 API de LauraGongoraMakeUp funcionando...');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});