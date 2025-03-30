const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const mongoose = require("mongoose");

router.post("/get-recommendation", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging

    const { bmi, userId } = req.body;
    if (!bmi) {
      return res.status(400).json({ error: "BMI is required" });
    }

    // Check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recommendation = await getBMISuggestions(bmi);
    res.json({ bmi, recommendation });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = { getBMISuggestions };
