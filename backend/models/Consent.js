const mongoose = require("mongoose");

const ConsentSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    grantedTo: { type: String, enum: ["DOCTOR", "CAREGEIVER", "AI"], required: true },
    scope: [String],
    purpose: String,
    expiresAt: Date,
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyUser" },
    revokedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consent", ConsentSchema);
