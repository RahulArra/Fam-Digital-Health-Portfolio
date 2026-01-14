const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const { requireAdmin } = require("../middleware/role.middleware");
const familyMemberController = require("../controllers/familyMember.controller");

const router = express.Router();

router.post(
  "/families/:familyId/members",
  authMiddleware,
  familyContextMiddleware,
  requireAdmin,
  familyMemberController.createFamilyMember
);

router.get(
  "/families/:familyId/members",
  authMiddleware,
  familyContextMiddleware,
  familyMemberController.getFamilyMembers
);

module.exports = router;
