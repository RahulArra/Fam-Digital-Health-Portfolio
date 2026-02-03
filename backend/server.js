require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const { runAllNotificationCrons } = require("./cron");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // ✅ Start notification crons ONLY after DB connection
    runAllNotificationCrons();

    setInterval(() => {
      runAllNotificationCrons();
    }, 24 * 60 * 60 * 1000);
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
