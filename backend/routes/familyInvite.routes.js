const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const { requireAdmin } = require("../middleware/role.middleware");

const {
  inviteUser,
  acceptInvite,
  cancelInvite
} = require("../controllers/familyInvite.controller");

const router = express.Router();

// Admin invites user by email
router.post(
  "/:familyId/invite",
  authMiddleware,
  familyContextMiddleware,
  requireAdmin,
  inviteUser
);

// Invited user accepts invite
router.post(
  "/invite/accept",
  authMiddleware,
  acceptInvite
);
router.patch(
  "/invite/:inviteId/cancel",
  authMiddleware,
  cancelInvite
);


module.exports = router;
