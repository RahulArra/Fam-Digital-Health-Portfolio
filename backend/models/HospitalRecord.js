const mongoose = require("mongoose");

const HospitalRecordSchema = new mongoose.Schema({
  userId: String,
  hospitalName: String,
  visitDate: String,
  doctorName: String,
  prescription: String, // Cloudinary Image URL
  diagnosis: String,
  medications: String,
  tests: String,
  nextAppointment: String,
});

module.exports = mongoose.model("HospitalRecord", HospitalRecordSchema);
