

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


router.get("/", getAllServices);


router.post("/create", authMiddleware, upload.single("image"), createService);


router.get("/my-services", authMiddleware, getServicesByProfessional);


router.get("/:id", authMiddleware, getServiceById);


router.put("/:id", authMiddleware, upload.single("image"), updateService);


router.delete("/:id", authMiddleware, deleteService);

module.exports = router;