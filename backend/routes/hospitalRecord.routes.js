const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const {
  requireGuardianOrSelf,
  preventDependentAction
} = require("../middleware/role.middleware");
const hospitalRecordController = require("../controllers/hospitalRecord.controller");

const router = express.Router();

router.post(
  "/members/:memberId/hospital-records",
  authMiddleware,
  
  familyContextMiddleware,
  requireGuardianOrSelf,
  preventDependentAction,
  hospitalRecordController.createRecord
);

router.get(
  "/members/:memberId/hospital-records",
  authMiddleware,

  familyContextMiddleware,
  requireGuardianOrSelf,
  hospitalRecordController.getRecords
);
router.patch(
  "/hospital-records/:recordId",
  authMiddleware,
  hospitalRecordController.updateHospitalRecord
);

module.exports = router;
