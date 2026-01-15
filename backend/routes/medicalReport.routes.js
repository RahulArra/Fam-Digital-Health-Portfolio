const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const {
  requireGuardianOrSelf,
  preventDependentAction
} = require("../middleware/role.middleware");
const medicalReportController = require("../controllers/medicalReport.controller");

const router = express.Router();

router.post(
  "/members/:memberId/medical-reports",
  authMiddleware,
  familyContextMiddleware,
  requireGuardianOrSelf,
  preventDependentAction,
  medicalReportController.createReport
);

router.get(
  "/members/:memberId/medical-reports",
  authMiddleware,
  familyContextMiddleware,
  requireGuardianOrSelf,
  medicalReportController.getReports
);

module.exports = router;
