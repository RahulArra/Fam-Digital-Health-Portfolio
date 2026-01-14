const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const {
  requireGuardianOrSelf,
  preventDependentAction
} = require("../middleware/role.middleware");
const healthProfileController = require("../controllers/healthProfile.controller");

const router = express.Router();

router.get(
  "/members/:memberId/health-profile",
  authMiddleware,
  familyContextMiddleware,
  requireGuardianOrSelf,
  healthProfileController.getHealthProfile
);

router.patch(
  "/members/:memberId/health-profile",
  authMiddleware,
  familyContextMiddleware,
  requireGuardianOrSelf,
  preventDependentAction,
  healthProfileController.updateHealthProfile
);

module.exports = router;
