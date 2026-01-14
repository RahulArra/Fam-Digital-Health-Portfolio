const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyContextMiddleware = require("../middleware/familyContext.middleware");
const { requireAdmin } = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/admin-check/:familyId",
  authMiddleware,
  familyContextMiddleware,
  requireAdmin,
  (req, res) => {
    res.json({ success: true, role: req.role });
  }
);

module.exports = router;
