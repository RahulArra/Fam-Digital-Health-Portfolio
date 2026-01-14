const mongoose = require("mongoose");

const MedicalReportSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    hospitalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "HospitalRecord" },

    reportType: String,
    fileUrl: String,
    filePublicId: String,

    extractedFindings: { type: Map, of: String },
    extractionConfidence: Number,
    extractedAt: Date,

    extractionSource: {
      type: String,
      enum: ["AI", "manual"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalReport", MedicalReportSchema);
