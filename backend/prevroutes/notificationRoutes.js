const express = require("express");
const {
  getNotifications,
  getUnreadCount,
  markAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authenticate");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.put("/:id/read", authMiddleware, markAsRead);

module.exports = router;
