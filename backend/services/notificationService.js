const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

const createNotification = async ({
  userId,
  type,
  title,
  message,
  priority = "LOW"
}) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    priority
  });

  if (priority === "HIGH") {
    const user = await User.findById(userId);

    if (
      user &&
      user.email &&
      user.notificationPreferences?.emailForHighPriority
    ) {
      await sendEmail({
        to: user.email,
        subject: `Health Alert: ${title}`,
        html: `<p>${message}</p>`
      });
    }
  }

  return notification;
};

module.exports = { createNotification };
