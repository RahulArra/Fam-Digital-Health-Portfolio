const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    type: { type: String, required: true },
    priority: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], required: true },
    isRead: { type: Boolean, default: false },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyUser" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
