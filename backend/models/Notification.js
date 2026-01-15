const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: ["FOLLOW_UP", "BMI_ALERT", "INACTIVITY", "SYSTEM"],
      required: true
    },

    title: String,
    message: String,

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW"
    },

    isRead: {
      type: Boolean,
      default: false
    },

    metadata: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
