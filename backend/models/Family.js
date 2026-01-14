const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema(
  {
    familyName: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Family", FamilySchema);
