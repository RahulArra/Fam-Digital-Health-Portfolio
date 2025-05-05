require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const profileRoutes = require("./routes/profile");
const hospitalRoutes = require("./routes/hospitalRoutes");
const visitorRoutes = require('./routes/visiterRoutes');
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
app.use("/hospital", hospitalRoutes);
const User = require("./models/User");  // Make sure to require the correct model
// Start server after ensuring DB is connected
app.use('/api/visitor', visitorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
