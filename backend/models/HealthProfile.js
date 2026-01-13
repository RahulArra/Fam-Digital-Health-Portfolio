const mongoose = require("mongoose");

const HealthProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  height: Number,
  weight: Number,
  // bmi: Number,
  bmiRecords: [
  {
    date: { type: Date, default: Date.now },
    height: Number,
    weight: Number,
    bmi: Number,
    category: String
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
  },
  updatedAt: {
  type: Date,
  default: Date.now
},
lastBmiAlert: {
  prevBmi: Number,
  lastBmi: Number
}


});

module.exports = mongoose.model("HealthProfile", HealthProfileSchema);
