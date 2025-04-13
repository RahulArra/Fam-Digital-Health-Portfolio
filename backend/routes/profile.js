

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const HealthProfile = require("../models/HealthProfile");
const authMiddleware = require("../routes/auth");
const User = require('../models/User');

// Get user health profile
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

// Create new health profile
// router.post("/", async (req, res) => {
//   const { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits } = req.body;

//   if (!userId || !height || !weight) {
//     return res.status(400).json({ message: "UserId, height, and weight are required" });
//   }

//   try {
//     const bmi = (weight / ((height / 100) ** 2)).toFixed(2); 

//     const healthProfile = new HealthProfile({
//       userId,
//       height,
//       weight,
//       bmiRecords: [{ bmi, date: new Date() }], // Store BMI as an array
//       age,
//       healthConditions,
//       medications,
//       therapies,
//       dailyActivity,
//       badHabits
//     });

//     const savedProfile = await healthProfile.save();
//     res.status(201).json(savedProfile);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
router.post("/", async (req, res) => {
  const { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits } = req.body;

  if (!userId || !height || !weight) {
    return res.status(400).json({ message: "UserId, height, and weight are required" });
  }

  try {
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2); 

    const healthProfile = new HealthProfile({
      userId,
      height,
      weight,
      bmiRecords: [{ bmi, date: new Date() }],
      age,
      healthConditions,
      medications,
      therapies,
      dailyActivity,
      badHabits
    });

    const savedProfile = await healthProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update health profile and append new BMI record
router.post("/:userId", async (req, res) => {
  try {
    const { height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits } = req.body;

    const bmi = (weight / ((height / 100) ** 2)).toFixed(2); // Calculate BMI dynamically

    const updatedProfile = await HealthProfile.findOneAndUpdate(
      { userId: req.params.userId },
      {
        height,
        weight,
        age,
        healthConditions,
        medications,
        therapies,
        dailyActivity,
        badHabits,
        $push: { bmiRecords: { bmi} } // Append new BMI record
      },
      {  new: true }
    );

    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});


module.exports = router;
