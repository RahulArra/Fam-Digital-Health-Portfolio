  const express = require("express");
  const authMiddleware = require("../middleware/auth.middleware.js");
  const familyController = require("../controllers/family.controller.js");

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
  router.post(
    "/join", 
    authMiddleware, 
    familyController.joinFamilyByCode);
  
    router.delete(
    "/:familyId/leave",
    authMiddleware,
    familyController.leaveFamily
  );

  module.exports = router;
