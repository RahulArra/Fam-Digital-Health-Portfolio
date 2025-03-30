const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const HealthProfile = require("../models/HealthProfile");
const authMiddleware = require("../routes/auth");
const User = require('../models/User');


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    let healthProfile = await HealthProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!healthProfile) {
      return res.status(404).json({ message: "Health profile not found!" });
    }

    res.json(healthProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.post("/", async (req, res) => {
  const { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits } = req.body;

  if (!userId || !height || !weight) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2); // BMI Calculation

    const healthProfile = new HealthProfile({  // Corrected variable name
      userId,  // Corrected ObjectId conversion
      height,
      weight,
      bmi,
      age,
      healthConditions,
      medications,
      therapies,
      dailyActivity,
      badHabits
    });

    const savedProfile = await healthProfile.save();
    console.log(savedProfile);
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});








// Add or update user profile
router.post("/:userId", async (req, res) => {
  try {
      const { height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits } = req.body;

      const updatedProfile = await healthProfile.findOneAndUpdate(
          { userId: req.params.userId },
          { height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits },
          { upsert: true, new: true }
      );

      res.json({ message: "Profile saved successfully", profile: updatedProfile });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// // ✅ POST: Add or Update health profile
// router.post("/:userId", authMiddleware, async (req, res) => {
//   try {
//     const { height, weight } = req.body;
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     const objectId = new mongoose.Types.ObjectId(userId);
//     let healthProfile = await HealthProfile.findOne({ userID: objectId });

//     if (healthProfile) {
//       // Update existing profile
//       healthProfile.height = height;
//       healthProfile.weight = weight;
//       await healthProfile.save();
//       return res.json({ message: "Profile updated", healthProfile });
//     } else {
//       // Create new profile
//       healthProfile = new HealthProfile({ userID: objectId, height, weight });
//       await healthProfile.save();
//       return res.json({ message: "Profile added", healthProfile });
//     }
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ error: "Seerrver error" });
//   }
// });

module.exports = router;