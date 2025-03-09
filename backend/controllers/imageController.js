const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ninguna imagen." });
        }

        const newImage = new Image({
            user: req.user.id,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: "Error subiendo la imagen", error });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await Image.find().populate('user', 'name email');
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo imágenes", error });
    }
};

module.exports = { uploadImage, getImages };