// backend/controllers/serviceController.js

const Service = require('../models/Service');
const Availability = require('../models/Availability');
const fs = require('fs');
const path = require('path');
const Booking = require('../models/Booking')

// Crear servicio
exports.createService = async (req, res) => {
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
    });

    if (req.file) {
      newService.image = `/uploads/${req.file.filename}`;
    }

    const savedService = await newService.save();

    const availDocs = availArray.map(dateTime => ({
      professional: req.user.id,
      service: savedService._id,
      dateTime,
    }));

    await Availability.insertMany(availDocs);

    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error al crear servicio:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Obtener todos los servicios
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener servicios.' });
  }
};

// Obtener servicios del profesional con disponibilidad
exports.getServicesByProfessional = async (req, res) => {
  try {
    const services = await Service.find({ professional: req.user.id });
    const servicesWithAvailability = await Promise.all(
      services.map(async service => {
        const availability = await Availability.find({ service: service._id });
        return { ...service.toObject(), availability };
      })
    );
    res.json(servicesWithAvailability);
  } catch (err) {
    console.error('Error al obtener servicios:', err);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Obtener un servicio por ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado.' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el servicio.' });
  }
};

// Actualizar servicio
exports.updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, category, availability = [], deleteAvailability = [] } = req.body;
  
      const service = await Service.findById(id);
      if (!service) return res.status(404).json({ message: 'Servicio no encontrado.' });
      if (service.professional.toString() !== req.user.id) {
        return res.status(403).json({ message: 'No autorizado.' });
      }
  
      service.name = name || service.name;
      service.description = description || service.description;
      service.price = price || service.price;
      service.category = category || service.category;
  
      if (req.file) {
        // Eliminar imagen anterior si existe
        if (service.image) {
          const oldPath = path.join(__dirname, '..', service.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        service.image = `/uploads/${req.file.filename}`;
      }
  
      await service.save();
  
      // Eliminar fechas indicadas
      if (Array.isArray(deleteAvailability) && deleteAvailability.length) {
        await Availability.deleteMany({ _id: { $in: deleteAvailability }, service: id });
      }
  
      // Añadir nuevas fechas sin duplicados
      const availArray = Array.isArray(availability)
        ? availability
        : typeof availability === 'string'
          ? [availability]
          : [];
  
      const existing = await Availability.find({ service: id }).distinct('dateTime');
      const newDates = availArray.filter(dt => !existing.includes(new Date(dt).toISOString()));
      const newAvail = newDates.map(dt => ({ professional: req.user.id, service: id, dateTime: dt }));
      if (newAvail.length) await Availability.insertMany(newAvail);
  
      res.json({ message: '✅ Servicio actualizado correctamente', service });
    } catch (err) {
      console.error('❌ Error al actualizar servicio:', err);
      res.status(500).json({ message: 'Error del servidor.' });
    }
  };

// Eliminar servicio
exports.deleteService = async (req, res) => {
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
    await Booking.deleteMany({ service: service._id });

    res.json({ message: 'Servicio eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar servicio:', err);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};
