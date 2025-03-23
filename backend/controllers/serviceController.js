const Service = require('../models/Service');

// 📌 Crear un servicio (solo profesionales pueden hacerlo)
exports.createService = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const professionalId = req.user.id;

        console.log("📌 Datos recibidos en el backend:", { name, description, price, category, professionalId });

        // Validar campos
        if (!name || !description || !price || !category || !professionalId) {
            return res.status(400).json({ message: '⚠️ Todos los campos son obligatorios.' });
        }

        if (typeof price !== "number") {
            return res.status(400).json({ message: '⚠️ El precio debe ser un número válido.' });
        }

        // Crear el nuevo servicio
        const newService = new Service({
            name,
            description,
            price,
            category,
            professional: professionalId
        });

        await newService.save();

        res.status(201).json({
            message: '✅ Servicio creado con éxito.',
            service: newService
        });

    } catch (error) {
        console.error('❌ Error al crear el servicio:', error);
        res.status(500).json({ message: '⚠️ Error en el servidor al crear el servicio.' });
    }
};

// 📌 Obtener todos los servicios
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate('professional', 'name email');
        res.json(services);
    } catch (error) {
        console.error('❌ Error al obtener los servicios:', error);
        res.status(500).json({ message: '⚠️ Error en el servidor al obtener los servicios.' });
    }
};

// 📌 Obtener servicios del profesional autenticado
exports.getServicesByProfessional = async (req, res) => {
    try {
        const professionalId = req.user.id;
        const services = await Service.find({ professional: professionalId });
        res.json({ services });
    } catch (error) {
        console.error('❌ Error al obtener los servicios del profesional:', error);
        res.status(500).json({ message: '⚠️ Error en el servidor al obtener tus servicios.' });
    }
};

// 📌 Eliminar un servicio
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: '⚠️ Servicio no encontrado.' });
        }

        if (service.professional.toString() !== req.user.id) {
            return res.status(403).json({ message: '⚠️ No tienes permiso para eliminar este servicio.' });
        }

        await service.deleteOne();
        res.json({ message: '✅ Servicio eliminado con éxito.' });

    } catch (error) {
        console.error('❌ Error al eliminar el servicio:', error);
        res.status(500).json({ message: '⚠️ Error en el servidor al eliminar el servicio.' });
    }
};