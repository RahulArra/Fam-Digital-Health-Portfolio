const mongoose = require("mongoose");

const FamilyInviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true
    },
    role: {
      type: String,
      enum: ["MEMBER"],
      default: "MEMBER"
    },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyInvite", FamilyInviteSchema);
