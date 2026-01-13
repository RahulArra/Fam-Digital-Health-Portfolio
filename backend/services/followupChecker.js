const HospitalRecord = require("../models/HospitalRecord");
const { createNotification } = require("./notificationService");

const checkFollowUps = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = await HospitalRecord.find({
    followUpRequired: true,
    followUpAlertSent: false,
    nextAppointment: { $exists: true }
  });

  for (const record of records) {
    const followUpDate = new Date(record.nextAppointment);
    followUpDate.setHours(0, 0, 0, 0);

    if (followUpDate <= today) {
      await createNotification({
        userId: record.userId,
        type: "FOLLOW_UP",
        title: "Doctor Follow-up Due",
        message: `Your follow-up visit at ${record.hospitalName} is due. Please consult your doctor.`,
        priority: "HIGH"
      });

      // 🔒 Mark as notified
      record.followUpAlertSent = true;
      await record.save();
    }
  }
};

module.exports = { checkFollowUps };
