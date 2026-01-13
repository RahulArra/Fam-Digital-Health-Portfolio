const cron = require("node-cron");
const { checkFollowUps } = require("../services/followUpChecker");
const { checkBMIChange } = require("../services/bmiAlertChecker");
const { checkInactivity } = require("../services/inactivityChecker");

cron.schedule("* * * * *", async () => {
  try {
    await checkFollowUps();
    await checkBMIChange();
    await checkInactivity();
  } catch (err) {
    console.error("Notification cron error:", err.message);
  }
});
