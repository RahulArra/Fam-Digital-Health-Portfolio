const HealthMetric = require("../models/HealthMetric");
const Notification = require("../models/Notification");
const { createNotification } = require("../services/notification.service");

const runBmiAlertCheck = async () => {
  try {
    const unhealthyMin = 18.5;
    const unhealthyMax = 25;

    // Get latest BMI per member
    const bmiMetrics = await HealthMetric.aggregate([
      { $match: { metricType: "BMI" } },
      { $sort: { recordedAt: -1 } },
      {
        $group: {
          _id: "$memberId",
          latestBmi: { $first: "$value" },
          familyId: { $first: "$familyId" }
        }
      }
    ]);

    for (const entry of bmiMetrics) {
      const bmi = entry.latestBmi;

      const isUnhealthy =
        bmi < unhealthyMin || bmi > unhealthyMax;

      if (!isUnhealthy) {
        continue;
      }

      // Deduplicate unresolved BMI alerts
      const existingNotification = await Notification.findOne({
        memberId: entry._id,
        type: "BMI_ALERT",
        acknowledgedAt: { $exists: false }
      });

      if (existingNotification) {
        continue;
      }

      await createNotification({
        familyId: entry.familyId,
        memberId: entry._id,
        type: "BMI_ALERT",
        priority: "MEDIUM",
        title: "BMI Alert",
        message: `Your BMI (${bmi}) is outside the healthy range. Consider reviewing your health habits.`
      });
    }
  } catch (error) {
    console.error("BMI alert cron failed", error);
  }
};

module.exports = { runBmiAlertCheck };
