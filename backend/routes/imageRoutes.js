const express = require('express');
const { uploadImage, getImages } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

// ✅ Subir imagen (solo usuarios autenticados)
router.post('/upload', authMiddleware, upload.single('image'), uploadImage);

// ✅ Obtener todas las imágenes
router.get('/all', getImages);

module.exports = router;