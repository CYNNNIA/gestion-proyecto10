
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createBooking,
  getBookingsByUser,
  cancelBooking,
  getAllBookings,
  getBookingsForProfessional,
  updateBooking, 
} = require("../controllers/bookingController");


router.post("/create", auth, createBooking);
router.get("/user", auth, getBookingsByUser);
router.get("/professional", auth, getBookingsForProfessional);
router.get("/all", auth, getAllBookings); 
router.delete("/:id", auth, cancelBooking);



router.put("/:id", auth, updateBooking);

module.exports = router;