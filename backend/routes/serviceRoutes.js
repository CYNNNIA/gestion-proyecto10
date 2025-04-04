const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const {
  createService,
  getAllServices,
  getServicesByProfessional,
  deleteService,
} = require('../controllers/serviceController');

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Rutas
router.post('/create', authMiddleware, upload.single('image'), createService);
router.get('/my-services', authMiddleware, getServicesByProfessional);
router.get('/', getAllServices);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;