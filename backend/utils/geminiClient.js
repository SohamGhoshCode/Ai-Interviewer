/**
 * geminiClient.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart Gemini model rotation client.
 *
 * Strategy:
 *  - Reads all available models from GEMINI_MODEL_LIST (comma-separated).
 *  - Keeps a persistent currentModelIndex in memory (round-robin, never resets
 *    between requests so quota is spread across models over time).
 *  - On each callGemini(prompt):
 *      1. Try current model.
 *      2. On 429 / quota error → log, wait 1 s, advance index, retry.
 *      3. After one full cycle with no success → throw a user-friendly error.
 *  - On success → advance index (so the NEXT call uses the next model,
 *    distributing load evenly even when quota is not exhausted).
 *
 * Usage:
 *   const { callGemini } = require("../utils/geminiClient");
 *   const text = await callGemini(prompt);
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Initialise SDK ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Build model list from env ─────────────────────────────────────────────────
// Falls back to GEMINI_MODEL (single model) or a safe default.
const MODELS = (
  process.env.GEMINI_MODEL_LIST ||
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash-lite"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

console.log(`[Gemini] Model pool loaded (${MODELS.length}): ${MODELS.join(" → ")}`);

// ── Rotation state ────────────────────────────────────────────────────────────
// Shared in-memory index. Persists across requests within one server process.
// Round-robin: advances after every call (success or rotation).
let currentModelIndex = 0;

/** Advance index, wrapping around the pool */
const nextIndex = (i) => (i + 1) % MODELS.length;

// ── Quota / rate-limit detection ──────────────────────────────────────────────
const isQuotaError = (err) => {
  if (!err) return false;
  const status = err.status ?? err.httpStatus ?? err.code;
  const msg = (err.message || "").toLowerCase();
  return (
    status === 429 ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("resource_exhausted") ||
    msg.includes("too many requests")
  );
};

// ── Core function ─────────────────────────────────────────────────────────────
/**
 * callGemini(prompt)
 *
 * Sends `prompt` to the Gemini API using the current model in the pool.
 * Automatically rotates to the next model on ANY error (quota, network,
 * model-specific failures, empty responses, etc.).
 *
 * Strategy:
 *  - Try each model in the pool sequentially, starting from currentModelIndex.
 *  - On ANY failure: log the reason, advance to the next model, and retry.
 *  - Only after ALL models are exhausted is an error surfaced to the caller.
 *  - This ensures a single button click triggers the full fallback chain.
 *
 * @param {string} prompt  The full text prompt to send.
 * @returns {Promise<string>} The raw text response from Gemini.
 * @throws {Error} If every model in the pool fails.
 */
const callGemini = async (prompt) => {
  // We allow at most MODELS.length attempts (one per model).
  const totalModels = MODELS.length;
  let attemptsLeft = totalModels;
  let lastError = null;

  while (attemptsLeft > 0) {
    const modelName = MODELS[currentModelIndex];

    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      // Reject empty / whitespace-only responses as a failure.
      if (!rawText || !rawText.trim()) {
        throw new Error("Empty response from model");
      }

      // ── Success ──────────────────────────────────────────────────────────
      console.log(`[Gemini] ✓ Used model: ${modelName} | Status: OK`);

      // Advance index for the NEXT request (distributes load evenly).
      currentModelIndex = nextIndex(currentModelIndex);

      return rawText;
    } catch (err) {
      lastError = err;
      const reason = isQuotaError(err) ? "quota/rate-limit" : "error";

      // ── Any failure → rotate to next model ──────────────────────────────
      // Do NOT throw here. Continue the loop to try the next model,
      // ensuring the full model pool is exhausted before surfacing an error.
      console.warn(
        `[Gemini] ✗ Model "${modelName}" failed (${reason}): ${err.message} — rotating to next model...`
      );

      currentModelIndex = nextIndex(currentModelIndex);
      attemptsLeft--;

      if (attemptsLeft > 0) {
        // Brief pause before retrying with the next model.
        const delay = isQuotaError(err) ? 1000 : 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // ── All models exhausted ──────────────────────────────────────────────────
  console.error(`[Gemini] All ${totalModels} model(s) failed. Last error: ${lastError?.message}`);
  throw new Error(
    "Failed to generate questions. Please check your API key and try again."
  );
};

module.exports = { callGemini };
