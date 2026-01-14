const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const familyController = require("../controllers/family.controller");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  familyController.createFamily
);

router.get(
  "/",
  authMiddleware,
  familyController.getMyFamilies
);

module.exports = router;
