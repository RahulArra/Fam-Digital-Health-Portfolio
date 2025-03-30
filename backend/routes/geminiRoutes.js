require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/recommend', async (req, res) => {
    try {
      const { age, weight, height, healthConditions, medications, therapies, dailyActivity, badHabits } = req.body;
  
      if (!age || !weight || !height) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const bmi = weight / ((height / 100) * (height / 100)); // Calculate BMI dynamically
  
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
      const prompt = `Provide a structured health recommendation based on:
  - Age: ${age}
  - Weight: ${weight} kg
  - Height: ${height} cm
  - BMI: ${bmi.toFixed(2)}
  - Pre-existing conditions: ${healthConditions || 'None'}
  - Medications: ${medications || 'None'}
  - Therapies: ${therapies || 'None'}
  - Daily Activity: ${dailyActivity || 'Unknown'}
  - Bad Habits: ${badHabits || 'None'}
  
  Response Format: 
  Diet: Recommended foods & foods to avoid.  
  Exercise: Best workouts & duration.  
  Lifestyle: Daily habits to adopt.
  
  Keep it brief, structured, and actionable.`;
  
      const result = await model.generateContent(prompt);
      const recommendation = result.response.text();
  
      res.json({ recommendation, bmi: bmi.toFixed(2) });
    } catch (error) {
      console.error('Error generating recommendation:', error);
      res.status(500).json({ error: 'Failed to generate recommendation' });
    }
  });
  

module.exports = router;
