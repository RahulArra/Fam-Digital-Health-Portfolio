const mongoose = require("mongoose");

const ConsentSchema = new mongoose.Schema(
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

    grantedTo: {
      type: String,
      enum: ["DOCTOR", "CAREGIVER", "AI"],
      required: true
    },

    scopes: [
      {
        type: String,
        enum: ["READ", "WRITE", "ANALYZE"]
      }
    ],

    purpose: String,

    expiresAt: Date,

    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    revokedAt: Date
  },
  { timestamps: true }
);
ConsentSchema.index({ familyId: 1, memberId: 1, grantedTo: 1 });

module.exports = mongoose.model("Consent", ConsentSchema);
