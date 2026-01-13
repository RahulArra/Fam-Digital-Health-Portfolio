const User = require("../models/User");

const updateEmailNotificationPreference = async (req, res) => {
  const { emailForHighPriority } = req.body;

  await User.findByIdAndUpdate(req.user.userID, {
    "notificationPreferences.emailForHighPriority": emailForHighPriority
  });

  res.json({ message: "Notification preference updated" });
};

module.exports = { updateEmailNotificationPreference };
