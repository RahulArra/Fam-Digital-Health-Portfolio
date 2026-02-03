const mongoose = require("mongoose");

const HealthMetricSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    metricType: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String },
    recordedAt: { type: Date, default: Date.now },
    source: {
      type: String,
      enum: ["manual", "report", "doctor", "AI"],
      default: "manual"
    },
    referenceRange: String
  },
  { timestamps: true }
);
HealthMetricSchema.index({ memberId: 1, metricType: 1, recordedAt: -1 });

module.exports = mongoose.model("HealthMetric", HealthMetricSchema);
