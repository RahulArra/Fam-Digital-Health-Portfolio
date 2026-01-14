const mongoose = require("mongoose");

const HealthProfileSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true, unique: true },

    physicalProfile: {
      height: Number,
      weight: Number,
      bloodGroup: String
    },

    lifestyleProfile: {
      smoking: Boolean,
      alcohol: Boolean,
      activityLevel: String,
      sleepPattern: String
    },

    chronicConditions: [String],
    longTermMedications: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthProfile", HealthProfileSchema);
