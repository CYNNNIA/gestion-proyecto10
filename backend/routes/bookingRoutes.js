const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookingsByUser,
  cancelBooking,
  getAllBookings
} = require("../controllers/bookingController");

router.post("/create", auth, createBooking);
router.get("/user", auth, getBookingsByUser); // ✅ Esta línea es importante
router.delete("/:id", auth, cancelBooking);

module.exports = router;