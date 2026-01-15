const HospitalRecord = require("../models/HospitalRecord");
const { createNotification } = require("../services/notification.service");

const runFollowUpCheck = async () => {
  const today = new Date();

  const records = await HospitalRecord.find({
    "followUp.required": true,
    "followUp.nextAppointment": { $lte: today },
    "followUp.followUpAlertSent": false
  });

  for (const record of records) {
    await createNotification({
      familyId: record.familyId,
      memberId: record.memberId,
      type: "FOLLOW_UP",
      priority: "HIGH",
      title: "Follow-up reminder",
      message: "You have a pending hospital follow-up."
    });

    record.followUp.followUpAlertSent = true;
    await record.save();
  }
};

module.exports = { runFollowUpCheck };
