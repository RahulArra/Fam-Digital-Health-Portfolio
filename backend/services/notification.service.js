const Notification = require("../models/Notification");
const { sendEmail } = require("./email.service");

const createNotification = async ({
  familyId,
  memberId,
  type,
  title,
  message,
  priority = "LOW",
  metadata = {}
}) => {
   const notification = await Notification.create({
    familyId,
    memberId,
    type,
    title,
    message,
    priority,
    metadata
  });

  if (priority === "HIGH" && metadata.email) {
    await sendEmail({
      to: metadata.email,
      subject: title,
      html: `<p>${message}</p>`
    });
  }

  return notification;
};

module.exports = { createNotification };
