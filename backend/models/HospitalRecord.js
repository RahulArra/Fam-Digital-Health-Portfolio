const mongoose = require("mongoose");

const HospitalRecordSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    hospitalName: String,
    visitDate: Date,
    doctorName: String,
    diagnosis: String,

    prescriptions: [
      {
        medicine: String,
        dosage: String,
        duration: String
      }
    ],

    followUp: {
      required: { type: Boolean, default: false },
      nextAppointment: Date,
      alertSent: { type: Boolean, default: false }
    },

    createdBy: {
      type: String,
      enum: ["ADMIN", "GUARDIAN", "DOCTOR"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HospitalRecord", HospitalRecordSchema);
