const mongoose = require("mongoose");

const HospitalRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  hospitalName: String,
  doctorName: String,

  visitDate: { type: Date, required: true },

  diagnosis: String,
  medications: String,
  tests: String,

  prescription: [String],
  prescriptionPublicId: [String],

  nextAppointment: Date,

  followUpRequired: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  followUpAlertSent: {
  type: Boolean,
  default: false
}
});

module.exports = mongoose.model("HospitalRecord", HospitalRecordSchema);
