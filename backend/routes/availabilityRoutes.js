
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addAvailability,
  getAvailabilityByProfessional,
  getAllAvailability,
  getAvailabilityByProfessionalId,
  getAvailabilityByServiceId
} = require("../controllers/availabilityController");

router.get("/all", getAllAvailability);
router.post("/add", auth, addAvailability);
router.get("/my-availability", auth, getAvailabilityByProfessional);
router.get("/professional/:professionalId", getAvailabilityByProfessionalId);
router.get("/service/:serviceId", getAvailabilityByServiceId);


router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await require('../models/Availability').findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: '✅ Eliminado' });
  } catch (err) {
    res.status(500).json({ message: '⚠️ Error del servidor' });
  }
});

module.exports = router;
