const express = require("express");
const authenticate = require("../middleware/authenticate");
const { updateEmailNotificationPreference } = require("../controllers/userController");

const router = express.Router();

router.put("/notification-preference", authenticate, updateEmailNotificationPreference);

module.exports = router;
