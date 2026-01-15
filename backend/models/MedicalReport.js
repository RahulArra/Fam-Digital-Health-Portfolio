const mongoose = require("mongoose");

const MedicalReportSchema = new mongoose.Schema(
  {
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      required: true
    },

    hospitalRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalRecord"
    },

    reportType: {
      type: String,
      required: true
      // examples: "BLOOD_TEST", "XRAY", "PRESCRIPTION", "SCAN"
    },

    file: {
      url: String,
      publicId: String,
      mimeType: String
    },

    extractedMetrics: [
      {
        metricType: String,
        value: Number,
        unit: String,
        referenceRange: String,
        confidence: Number
      }
    ],

    extractedBy: {
      type: String,
      enum: ["MANUAL", "AI"],
      default: "MANUAL"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalReport", MedicalReportSchema);
