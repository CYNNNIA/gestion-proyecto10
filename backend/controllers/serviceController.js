// backend/controllers/serviceController.js
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const fs = require('fs');
const path = require('path');

// Crear servicio
const createService = async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;

    const availArray = Array.isArray(availability)
      ? availability
      : typeof availability === 'string'
        ? [availability]
        : [];

    if (!name || !description || !price || !category || availArray.length === 0) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const newService = new Service({
      name,
      description,
      price: parseFloat(price),
      category,
      professional: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const savedService = await newService.save();

    for (const slot of availArray) {
      await Availability.create({
        service: savedService._id,
        professional: req.user.id,
        dateTime: slot
      });
    }

    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error al crear servicio:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Servicios propios
const getServicesByProfessional = async (req, res) => {
  try {
    const services = await Service.find({ professional: req.user.id });
    const servicesWithAvail = await Promise.all(
      services.map(async (s) => {
        const slots = await Availability.find({ service: s._id });
        return {
          ...s.toObject(),
          availabilities: slots.map(sl => sl.dateTime)
        };
      })
    );
    res.json(servicesWithAvail);
  } catch (err) {
    console.error('Error al obtener servicios:', err);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Todos los servicios
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('professional', 'name');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Eliminar servicio
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado.' });
    if (service.professional.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    if (service.image) {
      const imgPath = path.join(__dirname, '..', service.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Availability.deleteMany({ service: service._id });
    await service.deleteOne();

    res.json({ message: 'Servicio eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar servicio:', err);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

module.exports = {
  createService,
  getServicesByProfessional,
  getAllServices,
  deleteService
};
