const Notification = require("../models/Notification");

const createNotification = async ({
  familyId,
  memberId,
  type,
  title,
  message,
  priority = "LOW",
  metadata = {}
}) => {
  return Notification.create({
    familyId,
    memberId,
    type,
    title,
    message,
    priority,
    metadata
  });
};

module.exports = { createNotification };
