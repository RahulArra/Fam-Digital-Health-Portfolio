

const mongoose = require("mongoose");

const HospitalRecordSchema = new mongoose.Schema({
  userId: String,
  hospitalName: String,
  visitDate: String,
  doctorName: String,
  prescription: [String],           // Array of Cloudinary Image URLs
  prescriptionPublicId: [String],   // Array of Cloudinary public_ids
  diagnosis: String,
  medications: String,
  tests: String,
  nextAppointment: String,
});

module.exports = mongoose.model("HospitalRecord", HospitalRecordSchema);
