// backend/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createService,
  getAllServices,
  getServicesByProfessional,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Crear un nuevo servicio con imagen y disponibilidad
router.post("/create", authMiddleware, upload.single("image"), createService);

// Obtener todos los servicios (público)
router.get("/", getAllServices);

// Obtener los servicios del profesional autenticado
router.get("/my-services", authMiddleware, getServicesByProfessional);

// Obtener un servicio por ID (para edición)
router.get("/:id", authMiddleware, getServiceById);

// Actualizar un servicio existente
router.put("/:id", authMiddleware, upload.single("image"), updateService);

// Eliminar un servicio
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;