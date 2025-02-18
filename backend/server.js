require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;  // Match the variable name in .env

if (!MONGO_URI) {
  console.error('❌ Error: MONGODB_URI is not defined. Check your .env file.');
  process.exit(1);
}

console.log("Mongo URI:", MONGO_URI);

// Connect to MongoDB only ONCE
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
