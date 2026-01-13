const express = require("express");
const authenticate = require("../middlware/authMiddleware");
const { createNotification } = require("../services/notificationService");

const router = express.Router();

router.post("/test-email", authenticate, async (req, res) => {
  await createNotification({
    userId: req.user.userID,
    type: "ALERT",
    title: "Critical Health Alert",
    message: "This is a test HIGH priority email notification.",
    priority: "HIGH"
  });

  res.json({ message: "Test notification triggered" });
});

module.exports = router;
