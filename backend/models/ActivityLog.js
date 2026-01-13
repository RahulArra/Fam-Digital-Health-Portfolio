import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ActivityLog", activityLogSchema);
