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
// Chat Conversation Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // Build the prompt with context
    let prompt = `You are a health assistant. Respond to this message: "${message}"`;
    
    if (context) {
      // Calculate BMI if not provided
      let bmiDisplay = 'Not calculated';
      if (context.height && context.weight) {
        const heightInMeters = context.height / 100;
        const bmi = context.weight / (heightInMeters * heightInMeters);
        bmiDisplay = bmi.toFixed(2);
      } else if (context.bmi) {
        // If BMI is provided directly, ensure it's a number
        bmiDisplay = typeof context.bmi === 'number' ? context.bmi.toFixed(2) : context.bmi;
      }

      prompt += `\n\nContext about the user:
- Age: ${context.age || 'Not specified'}
- Height: ${context.height || 'Not specified'} cm
- Weight: ${context.weight || 'Not specified'} kg
- BMI: ${bmiDisplay}
- Health Conditions: ${context.healthConditions || 'None'}
- Medications: ${context.medications || 'None'}
- Therapies: ${context.therapies || 'None'}
- Daily Activity: ${context.dailyActivity || 'Not specified'}
- Bad Habits: ${context.badHabits || 'None'}`;
    }

    prompt += "\n\nKeep your response concise, friendly, and focused on health advice.";

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;