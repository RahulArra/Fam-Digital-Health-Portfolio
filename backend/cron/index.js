const cron = require("node-cron");
const { runFollowUpCheck } = require("./followUp.cron");

cron.schedule("0 9 * * *", runFollowUpCheck);
