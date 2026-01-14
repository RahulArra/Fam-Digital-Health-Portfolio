const mongoose = require("mongoose");

const FamilyMemberSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family", required: true },
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },
    email: { type: String },
    guardians: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema);
