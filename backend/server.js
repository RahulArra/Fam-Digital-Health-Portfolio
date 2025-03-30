require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const HealthProfile = require('./models/HealthProfile'); // Use the correct model
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const profileRoutes = require("./routes/profile");

if (!MONGO_URI) {
  console.error('Error: MONGODB_URI is not defined. Check your .env file.');
  process.exit(1);
}

console.log("Mongo URI:", MONGO_URI);

// Connect to MongoDB before defining routes
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });


app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use(express.json());
app.use("/api/profile", profileRoutes);
const geminiRoutes = require('./routes/geminiRoutes');
app.use('/api/gemini', geminiRoutes);
app.use("/api/profilepost",profileRoutes);
app.use('/api/auth', authRoutes);

// app.use("/api/user", profileRoutes);


// Fetch user health profile by ID from `health_profiles` collection
const User = require("./models/User");  // Make sure to require the correct model

// app.get('/api/user/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Fetching user with ID:", id); // Debugging log

//     if (!id || id === "null") {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("User Fetch Error:", error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// Start server after ensuring DB is connected
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
