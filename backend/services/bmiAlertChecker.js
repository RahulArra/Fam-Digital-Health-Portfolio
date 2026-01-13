const HealthProfile = require("../models/HealthProfile");
const { createNotification } = require("./notificationService");

const checkBMIChange = async () => {
  const profiles = await HealthProfile.find();

  for (const profile of profiles) {
    if (!Array.isArray(profile.bmiRecords)) continue;

    const validRecords = profile.bmiRecords.filter(
      r => r && typeof r.bmi === "number" && r.date
    );

    if (validRecords.length < 2) continue;

    validRecords.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const last = validRecords[validRecords.length - 1];
    const prev = validRecords[validRecords.length - 2];

    const diff = Math.abs(last.bmi - prev.bmi);

    // 🔒 DUPLICATE PREVENTION
    if (
      profile.lastBmiAlert &&
      profile.lastBmiAlert.prevBmi === prev.bmi &&
      profile.lastBmiAlert.lastBmi === last.bmi
    ) {
      continue; // already notified for this change
    }

    if (diff >= 1) {
      await createNotification({
        userId: profile.userId,
        type: "ALERT",
        title: "BMI Change Detected",
        message: `Your BMI changed from ${prev.bmi} to ${last.bmi}.`,
        priority: "HIGH"
      });

      // ✅ Save alert state
      profile.lastBmiAlert = {
        prevBmi: prev.bmi,
        lastBmi: last.bmi
      };

      await profile.save();
    }
  }
};

module.exports = { checkBMIChange };
