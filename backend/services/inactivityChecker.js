const HealthProfile = require("../models/HealthProfile");
const { createNotification } = require("./notificationService");

const checkInactivity = async () => {
  const today = new Date();

  // 7 days ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  // Find users whose last BMI update is older than 7 days
  const profiles = await HealthProfile.find({
    "bmiRecords.0": { $exists: true }
  });

  for (const profile of profiles) {
    const lastRecord =
      profile.bmiRecords[profile.bmiRecords.length - 1];

    if (new Date(lastRecord.date) <= oneWeekAgo) {
      await createNotification({
        userId: profile.userId,
        type: "INACTIVITY",
        title: "Health Data Update Required",
        message:
          "You have not updated your health details for over a week. Please update your records to keep your health tracking accurate.",
        priority: "HIGH"
      });
    }
  }
};

module.exports = { checkInactivity };
