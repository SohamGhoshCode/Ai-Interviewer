/**
 * aiController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All Gemini API calls go through the smart rotation client (geminiClient.js).
 * No direct SDK calls here — quota rotation is handled transparently.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { callGemini } = require("../utils/geminiClient");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

/** Strip markdown code fences Gemini sometimes wraps around JSON */
const cleanJSON = (raw) =>
  raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

// ── Generate interview questions ───────────────────────────────────────────────
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    // callGemini handles model rotation + retries internally
    const rawText = await callGemini(prompt);

    const data = JSON.parse(cleanJSON(rawText));
    res.status(200).json(data);
  } catch (error) {
    console.error("[aiController] generateInterviewQuestions error:", error.message);

    const isQuota =
      error.message?.includes("quota") ||
      error.message?.includes("429") ||
      error.message?.includes("rate limit") ||
      error.status === 429;

    res.status(isQuota ? 429 : 500).json({
      message: isQuota
        ? "All AI models are currently busy. Please wait a moment and try again."
        : "Failed to generate questions. Please check your API key and try again.",
      error: error.message,
    });
  }
};

// ── Generate concept explanation ──────────────────────────────────────────────
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    // callGemini handles model rotation + retries internally
    const rawText = await callGemini(prompt);

    const data = JSON.parse(cleanJSON(rawText));
    res.status(200).json(data);
  } catch (error) {
    console.error("[aiController] generateConceptExplanation error:", error.message);

    const isQuota =
      error.message?.includes("quota") ||
      error.message?.includes("429") ||
      error.message?.includes("rate limit") ||
      error.status === 429;

    res.status(isQuota ? 429 : 500).json({
      message: isQuota
        ? "All AI models are currently busy. Please wait a moment and try again."
        : "Failed to generate explanation. Please check your API key and try again.",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
