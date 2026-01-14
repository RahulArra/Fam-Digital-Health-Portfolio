const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userID
    }).sort({ createdAt: -1 });

    res.json(notifications);
    console.log("REQ USER:", req.user);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.userID,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead
};
