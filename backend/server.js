require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow local dev + any Vercel preview/production domain
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // set this in Vercel env vars → your frontend URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)       // allow all *.vercel.app previews
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── DB ────────────────────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Serve uploads folder (local only — on Vercel use Cloudinary URLs directly)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "ASAP! Interviewer API is running ✅", env: process.env.NODE_ENV });
});

// ── Start server (local only — Vercel handles this automatically) ─────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
