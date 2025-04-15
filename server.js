const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión:", err));


const authRoutes = require("./backend/routes/authRoutes");
const bookingRoutes = require("./backend/routes/bookingRoutes");
const serviceRoutes = require("./backend/routes/serviceRoutes");
const availabilityRoutes = require("./backend/routes/availabilityRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/availability", availabilityRoutes);


app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));


app.use(express.static(path.join(__dirname, "frontend", "public")));


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});