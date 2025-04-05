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
  deleteService
} = require("../controllers/serviceController");

// ✅ Ruta pública para obtener todos los servicios
router.get("/", getAllServices);

// ✅ Crear un nuevo servicio
router.post("/create", authMiddleware, upload.single("image"), createService);

// ✅ Obtener servicios de un profesional autenticado
router.get("/my-services", authMiddleware, getServicesByProfessional);

// ✅ Obtener un servicio específico (para edición)
router.get("/:id", authMiddleware, getServiceById);

// ✅ Actualizar servicio
router.put("/:id", authMiddleware, upload.single("image"), updateService);

// ✅ Eliminar servicio
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;