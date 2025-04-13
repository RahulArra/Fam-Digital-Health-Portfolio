const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HealthProfile = require('../models/HealthProfile');
const authenticate = require('../middleware/authenticate'); // Adjust path if needed
const sendVerificationMail = require('./sendVerificationMail');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(403).json({ error: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const healthProfile = await HealthProfile.findOne({ userID: user._id });

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      userID: user._id,
      healthProfile,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
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
      Phone,
      verified: false
    });

    await user.save();

    await sendVerificationMail(user); // Sends email with verification token

    res.status(201).json({ 
      message: "User registered successfully. Please verify your email.",
      userID: user._id, 
      name, 
      email,
      Phone
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).send('User not found');

    if (user.verified) return res.send('Email already verified');

    user.verified = true;
    console.log(user);
    await user.save();

    res.send('Email verified successfully! You can now login.');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
});




module.exports = router;
