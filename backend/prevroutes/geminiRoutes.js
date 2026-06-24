require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  buildTransientContext,
  deriveBMI,
  retrieveRelevantPatientContext,
  serializeGrounding
} = require("../services/ragService");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGroundedContext({ userId, fallbackPayload, query, topK = 5 }) {
  if (userId) {
    const ragContext = await retrieveRelevantPatientContext(userId, query, { topK });
    if (ragContext.profile || ragContext.records.length) {
      return ragContext;
    }
  }

  return buildTransientContext(fallbackPayload);
}

function buildRecommendationPrompt(query, contextBlock) {
  return `You are HealthTrack's retrieval-augmented health assistant.

Use only the patient data provided in the retrieved context. Do not invent diagnoses, prescriptions, or lab findings. If data is missing, say what is missing.

Patient goal:
${query}

Retrieved patient context:
${contextBlock}

Return markdown with these sections:
## Personalized Snapshot
## Diet Suggestions
## Activity and Recovery
## Medication Reminders
## Follow-up and Monitoring
## Risks to Watch

Keep the advice concise, practical, and tailored to the patient's conditions, BMI trend, medications, daily activity, and recent hospital visits.`;
}

function buildChatPrompt(message, contextBlock) {
  return `You are HealthTrack's retrieval-augmented health assistant.

Answer the user's question using only the retrieved patient context below. If the context does not support a claim, say that more data or a clinician is needed.

User message:
${message}

Retrieved patient context:
${contextBlock}

Respond in friendly markdown. Prioritize personalized guidance, medication adherence reminders when relevant, and follow-up awareness.`;
}

router.get("/grounding/:userId", async (req, res) => {
  try {
    const query = req.query.query || "Summarize the patient's current health priorities.";
    const ragContext = await retrieveRelevantPatientContext(req.params.userId, query, { topK: 6 });

    res.json({
      query,
      grounding: serializeGrounding(ragContext.matches, ragContext.summary)
    });
  } catch (error) {
    console.error("Error generating grounding preview:", error);
    res.status(500).json({ error: "Failed to retrieve patient context" });
  }
});

router.post("/recommend", async (req, res) => {
  try {
    const {
      userId,
      age,
      weight,
      height,
      healthConditions,
      medications,
      therapies,
      dailyActivity,
      badHabits,
      query
    } = req.body;

    const retrievalQuery =
      query ||
      "Generate a personalized health plan with diet suggestions, activity guidance, medication reminders, follow-up insights, and risk watchouts.";

    const groundedContext = await getGroundedContext({
      userId,
      fallbackPayload: {
        age,
        weight,
        height,
        healthConditions,
        medications,
        therapies,
        dailyActivity,
        badHabits
      },
      query: retrievalQuery,
      topK: 6
    });

    const bmi =
      deriveBMI(groundedContext.profile) ||
      (height && weight
        ? Number((weight / ((height / 100) * (height / 100))).toFixed(2))
        : null);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      buildRecommendationPrompt(retrievalQuery, groundedContext.contextBlock)
    );
    const recommendation = result.response.text();

    res.json({
      recommendation,
      bmi: bmi ? bmi.toFixed(2) : null,
      grounding: serializeGrounding(groundedContext.matches, groundedContext.summary)
    });
  } catch (error) {
    console.error("Error generating grounded recommendation:", error);
    res.status(500).json({ error: "Failed to generate recommendation" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const groundedContext = await getGroundedContext({
      userId,
      fallbackPayload: context,
      query: message,
      topK: 5
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(buildChatPrompt(message, groundedContext.contextBlock));
    const reply = result.response.text();

    res.json({
      reply,
      grounding: serializeGrounding(groundedContext.matches, groundedContext.summary)
    });
  } catch (error) {
    console.error("Error in grounded chat endpoint:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

module.exports = router;
