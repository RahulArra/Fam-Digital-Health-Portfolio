const HealthMetric = require("../models/HealthMetric");
const Notification = require("../models/Notification");
const { createNotification } = require("../services/notification.service");

const INACTIVITY_DAYS = 30;

const runInactivityCheck = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - INACTIVITY_DAYS);

    // Find latest activity per member
    const lastActivity = await HealthMetric.aggregate([
      { $sort: { recordedAt: -1 } },
      {
        $group: {
          _id: "$memberId",
          lastRecordedAt: { $first: "$recordedAt" },
          familyId: { $first: "$familyId" }
        }
      }
    ]);

    for (const entry of lastActivity) {
      if (entry.lastRecordedAt > cutoffDate) continue;

      // Deduplicate unresolved inactivity notifications
      const existingNotification = await Notification.findOne({
        memberId: entry._id,
        type: "INACTIVITY_REMINDER",
        acknowledgedAt: { $exists: false }
      });

      if (existingNotification) continue;

      await createNotification({
        familyId: entry.familyId,
        memberId: entry._id,
        type: "INACTIVITY_REMINDER",
        priority: "LOW",
        title: "Health update reminder",
        message:
          "No health updates have been recorded recently. Consider reviewing or updating health information."
      });
    }
  } catch (error) {
    console.error("Inactivity reminder cron failed", error);
  }
};

module.exports = { runInactivityCheck };
