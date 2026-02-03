const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema(
  {
    familyName: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active"
    },
    joinCode: {
      type: String,
      unique: true,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Family", FamilySchema);
