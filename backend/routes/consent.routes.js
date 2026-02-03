const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const { requireGuardianOrSelf } = require("../middleware/role.middleware");
const consentController = require("../controllers/consent.controller");

const router = express.Router();

router.post(
  "/members/:memberId/consents",
  authMiddleware,
  familyContextMiddleware,
  requireGuardianOrSelf,
  consentController.grantConsent
);

router.get(
  "/members/:memberId/consents",
  authMiddleware,
  familyContextMiddleware,
  requireGuardianOrSelf,
  consentController.listConsents
);

router.patch(
  "/consents/:consentId/revoke",
  authMiddleware,
  familyContextMiddleware,
  consentController.revokeConsent
);

module.exports = router;
