const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HealthProfile = require('../models/HealthProfile');
const authenticate = require('../middleware/authenticate'); // Adjust path if needed

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // console.log("Login Request for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    // console.log("JWT Secret:", process.env.JWT_SECRET);
    // console.log("User Found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // console.log("Password matched successfully");

    // Debugging health profile retrieval
    const healthProfile = await HealthProfile.findOne({ userID: user._id });
    // console.log("Health Profile Found:", healthProfile);

    // Debugging JWT token generation
    console.log("Generating JWT Token");
    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // console.log("Login Successful. Sending response...");

    res.json({
      userID: user._id,
      healthProfile,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Serverr error" });
  }
});

// Fetch user details
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;  // Extracting user ID from the URL

  try {
      let userDetails = await User.findById(userId);

      if (!userDetails) {
          return res.status(404).json({ message: "User not found Here!!" });
      }

      res.json(userDetails);
  } catch (error) {
      res.status(500).json({ message: "Serrvver error", error: error.message });
  }
});


router.post('/register', async (req, res) => {
  const { name, email, password, Phone } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      Phone
    });

    await user.save();

    res.status(201).json({ 
      message: "User registered successfully",
      userID: user._id, 
      name, 
      email,
      Phone
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});








module.exports = router;
