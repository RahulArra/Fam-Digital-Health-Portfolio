const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model

// Get user details
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    let userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
