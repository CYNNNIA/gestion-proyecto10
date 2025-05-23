
const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Availability", availabilitySchema);