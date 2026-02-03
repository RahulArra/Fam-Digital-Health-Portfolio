const { runFollowUpCheck } = require("./followUp.cron");
const { runBmiAlertCheck } = require("./bmiAlert.cron");
const { runInactivityCheck } = require("./inactivityReminder.cron");

const runAllNotificationCrons = async () => {
  await runFollowUpCheck();
  await runBmiAlertCheck();
  await runInactivityCheck();
};

module.exports = { runAllNotificationCrons };
