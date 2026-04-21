const { GoogleGenerativeAI } = require("@google/generative-ai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

// Initialize Gemini with API Key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: retry with exponential backoff for 429 rate-limit errors
const generateWithRetry = async (model, prompt, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result;
        } catch (error) {
            const isRateLimit = error.status === 429 || (error.message && error.message.includes("429"));
            if (isRateLimit && attempt < maxRetries) {
                // Extract retry delay from error or use exponential backoff
                const retryDelay = (error.errorDetails?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay) || `${attempt * 5}s`;
                const delayMs = (parseInt(retryDelay) || attempt * 5) * 1000;
                console.log(`Rate limited. Retrying in ${delayMs / 1000}s (attempt ${attempt}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, delayMs + 1000)); // add 1s buffer
            } else {
                throw error;
            }
        }
    }
};

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        // Get the model from env (falls back to gemini-2.5-flash)
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });

        // Generate content with retry logic
        const result = await generateWithRetry(model, prompt);
        const response = await result.response;
        const rawText = response.text();

        // Clean JSON response: Remove ```json and ``` patterns
        const cleanedText = rawText
            .replace(/^```json\s*/, "") 
            .replace(/```$/, "") 
            .trim(); 

        // Parse and return
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);       
    } catch (error) {
        console.error("Gemini Error:", error);
        const isRateLimit = error.status === 429 || (error.message && error.message.includes("429"));
        res.status(isRateLimit ? 429 : 500).json({ 
            message: isRateLimit 
                ? "API rate limit reached. Please wait a moment and try again, or upgrade your Gemini plan."
                : "Failed to generate questions. Check if your API key is valid and has Gemini access.", 
            error: error.message 
        });
    }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = conceptExplainPrompt(question);

        // Get the model from env (falls back to gemini-2.5-flash)
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });

        // Generate content with retry logic
        const result = await generateWithRetry(model, prompt);
        const response = await result.response;
        const rawText = response.text();

        // Clean and parse
        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();

        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch (error) {
        console.error("Gemini Error:", error);
        const isRateLimit = error.status === 429 || (error.message && error.message.includes("429"));
        res.status(isRateLimit ? 429 : 500).json({ 
            message: isRateLimit 
                ? "API rate limit reached. Please wait a moment and try again, or upgrade your Gemini plan."
                : "Failed to generate explanation. Check your Gemini API Key.", 
            error: error.message 
        });     
    }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
