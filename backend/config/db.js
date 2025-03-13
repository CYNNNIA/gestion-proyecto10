const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`🟢 Conectado a MongoDB: ${conn.connection.host}`);

        // Escuchar eventos de la conexión
        mongoose.connection.on('disconnected', () => {
            console.log('🔴 Desconectado de MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`⚠️ Error en la conexión a MongoDB: ${err}`);
        });

    } catch (error) {
        console.error(`🔴 Error conectando a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;