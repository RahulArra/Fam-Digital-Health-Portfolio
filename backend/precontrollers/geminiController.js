const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function getBMISuggestions(bmi) {
    try {
        console.log("BMI Received:", bmi); // Debugging line
        
        const prompt = `A person has a BMI of ${bmi}. Provide diet and exercise recommendations.`;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(prompt);

        console.log("Gemini API Raw Response:", JSON.stringify(response, null, 2));

        if (!response.response || !response.response.candidates) {
            throw new Error("Unexpected API response structure");
        }

        return response.response.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error generating BMI suggestions:", error);
        throw new Error("Failed to generate BMI suggestions");
    }
}
module.exports = { getBMISuggestions };
