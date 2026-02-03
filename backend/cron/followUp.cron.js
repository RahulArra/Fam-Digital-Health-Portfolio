const HospitalRecord = require("../models/HospitalRecord");
const Notification = require("../models/Notification");
const { createNotification } = require("../services/notification.service");

const runFollowUpCheck = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await HospitalRecord.find({
      "followUp.required": true,
      "followUp.nextAppointment": { $exists: true }
    });

    for (const record of records) {
      const appointmentDate = new Date(record.followUp.nextAppointment);
      appointmentDate.setHours(0, 0, 0, 0);

      const diffDays =
        (appointmentDate - today) / (1000 * 60 * 60 * 24);

      // Notify 2 days before OR if appointment is missed
      if (diffDays > 2) continue;

      // Deduplication based on unresolved notification
      const existingNotification = await Notification.findOne({
        memberId: record.memberId,
        type: "FOLLOW_UP",
        acknowledgedAt: { $exists: false }
      });

      if (existingNotification) continue;

      await createNotification({
        familyId: record.familyId,
        memberId: record.memberId,
        type: "FOLLOW_UP",
        priority: "HIGH",
        title: "Follow-up reminder",
        message: `You have a hospital follow-up scheduled on ${appointmentDate.toDateString()}.`
      });
    }
  } catch (error) {
    console.error("Follow-up cron failed", error);
  }
};

module.exports = { runFollowUpCheck };
