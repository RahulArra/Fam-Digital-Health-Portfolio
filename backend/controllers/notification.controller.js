const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");

const getNotifications = async (req, res, next) => {
  try {
    let filter = { familyId: req.family._id };

    if (req.role !== "ADMIN") {
      filter.memberId = req.familyUser.memberId;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(new ApiError(404, "Notification not found"));
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
};

const acknowledgeNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return next(new ApiError(404, "Notification not found"));
    }

    if (notification.acknowledgedAt) {
      return next(new ApiError(400, "Already acknowledged"));
    }

    notification.acknowledgedAt = new Date();
    notification.isRead = true;

    await notification.save();

    res.json({ message: "Notification acknowledged" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getNotifications,
  markAsRead,
  acknowledgeNotification
};
