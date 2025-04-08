const mongoose = require("mongoose");

const HealthProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  height: Number,
  weight: Number,
  // bmi: Number,
  bmiRecords: [
    {
      date: { type: Date, default: Date.now }, 
      bmi: Number
    }
  ],
  
  age: Number,
  healthConditions: [String],  
  medications: [String],       
  therapies: [String],         
  badHabits: [String],  
  dailyActivity: {
    exercise: String,
    steps: Number,
    waterIntake: String,
    sleepHours: String,
  }
});

module.exports = mongoose.model("HealthProfile", HealthProfileSchema);
