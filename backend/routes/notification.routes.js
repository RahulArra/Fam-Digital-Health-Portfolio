const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const notificationController = require("../controllers/notification.controller");

const router = express.Router();

router.get(
  "/notifications",
  authMiddleware,
  familyContextMiddleware,
  notificationController.getNotifications
);

router.patch(
  "/notifications/:id/read",
  authMiddleware,
  familyContextMiddleware,
  notificationController.markAsRead
);
router.patch(
  "/:id/acknowledge",
  authMiddleware,
  notificationController.acknowledgeNotification
);

module.exports = router;
