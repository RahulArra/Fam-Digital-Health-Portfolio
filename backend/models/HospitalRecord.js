const mongoose = require("mongoose");

const HospitalRecordSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      required: true
    },

    hospitalName: String,
    doctorName: String,
    visitDate: {
      type: Date,
      required: true
    },

    diagnosis: String,
    notes: String,

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
      followUpAlertSent: { type: Boolean, default: false }
    },

    medicalReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalReport"
      }
    ],

    createdBy: {
      role: {
        type: String,
        enum: ["ADMIN", "GUARDIAN", "DOCTOR"],
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      externalName: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HospitalRecord", HospitalRecordSchema);
