const mongoose = require("mongoose");

const FamilyUserSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family", required: true },
    role: { type: String, enum: ["ADMIN", "MEMBER"], required: true },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyUser", FamilyUserSchema);
