const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));

// 🔌 Rutas backend
app.use("/api/auth", require("./backend/routes/authRoutes"));
app.use("/api/services", require("./backend/routes/serviceRoutes"));
app.use("/api/availability", require("./backend/routes/availabilityRoutes"));
app.use("/api/bookings", require("./backend/routes/bookingRoutes"));

// 👉 Sirve archivos estáticos desde frontend/public
app.use(express.static(path.join(__dirname, "frontend/public")));

// ⚠️ Para cualquier ruta que no sea API, devuelve index.html del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/public", "index.html"));
});

// DB Connection + Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("🟢 Conectado a MongoDB");
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
}).catch((err) => {
  console.error("❌ Error al conectar a MongoDB:", err);
});