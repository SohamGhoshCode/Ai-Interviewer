/**
 * showLookupResult.js
 * -------------------
 * Demonstrates MongoDB $lookup (aggregation pipeline) for class presentation.
 *
 * Run:  node showLookupResult.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

// ── Schemas ──────────────────────────────────────────────────────────────────
const Session = mongoose.model(
  "Session",
  new mongoose.Schema(
    {
      user:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role:         String,
      experience:   String,
      topicsToFocus: String,
      description:  String,
      questions:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    },
    { timestamps: true }
  )
);

const Question = mongoose.model(
  "Question",
  new mongoose.Schema(
    {
      session:  { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
      question: String,
      answer:   String,
      note:     String,
      isPinned: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

// ── Helper ────────────────────────────────────────────────────────────────────
function printSection(title) {
  const line = "─".repeat(60);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(line);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB");

  // ── DEMO 1: Raw $lookup ────────────────────────────────────────────────────
  printSection("DEMO 1 — $lookup: Join sessions with questions");
  console.log(`
  Pipeline:
    { $lookup: {
        from:         "questions",
        localField:   "_id",       ← session._id
        foreignField: "session",   ← question.session
        as:           "questionDetails"
    }}
  `);

  const lookupResult = await Session.aggregate([
    {
      $lookup: {
        from:         "questions",
        localField:   "_id",
        foreignField: "session",
        as:           "questionDetails",
      },
    },
    // Show only the first 2 sessions to keep output readable
    { $limit: 2 },
    {
      $project: {
        role:            1,
        experience:      1,
        topicsToFocus:   1,
        questionDetails: {
          $map: {
            input: "$questionDetails",
            as:    "q",
            in: {
              question: "$$q.question",
              isPinned: "$$q.isPinned",
            },
          },
        },
        totalQuestionsJoined: { $size: "$questionDetails" },
      },
    },
  ]);

  console.log("Result (first 2 sessions with their joined questions):");
  console.log(JSON.stringify(lookupResult, null, 2));

  // ── DEMO 2: Full Aggregation Pipeline (what getSessionStats uses) ──────────
  printSection("DEMO 2 — Full Pipeline: $lookup → $addFields → $group → $project");
  console.log(`
  Stages:
    1. $lookup   → join questions
    2. $addFields → count total & pinned per session
    3. $group    → roll all sessions into one summary (_id: null)
    4. $project  → clean output
  `);

  const statsResult = await Session.aggregate([
    // Stage 1 — join
    {
      $lookup: {
        from:         "questions",
        localField:   "_id",
        foreignField: "session",
        as:           "questionDetails",
      },
    },

    // Stage 2 — per-session counts
    {
      $addFields: {
        totalQuestions: { $size: "$questionDetails" },
        pinnedQuestions: {
          $size: {
            $filter: {
              input: "$questionDetails",
              as:    "q",
              cond:  { $eq: ["$$q.isPinned", true] },
            },
          },
        },
      },
    },

    // Stage 3 — collapse to one summary doc
    {
      $group: {
        _id:                 null,
        totalSessions:       { $sum: 1 },
        totalQuestions:      { $sum: "$totalQuestions" },
        totalPinnedQuestions:{ $sum: "$pinnedQuestions" },
        rolesPracticed:      { $addToSet: "$role" },
      },
    },

    // Stage 4 — clean output
    {
      $project: {
        _id:                  0,
        totalSessions:        1,
        totalQuestions:       1,
        totalPinnedQuestions: 1,
        rolesPracticed:       1,
      },
    },
  ]);

  const summary = statsResult[0] || {
    totalSessions: 0,
    totalQuestions: 0,
    totalPinnedQuestions: 0,
    rolesPracticed: [],
  };

  console.log("Summary Result:");
  console.log(JSON.stringify(summary, null, 2));

  // ── Pretty print ───────────────────────────────────────────────────────────
  printSection("FINAL STATS (What the dashboard shows)");
  console.log(`  Total Sessions       : ${summary.totalSessions}`);
  console.log(`  Total Questions      : ${summary.totalQuestions}`);
  console.log(`  Pinned Questions     : ${summary.totalPinnedQuestions}`);
  console.log(`  Unique Roles Practiced: ${summary.rolesPracticed.join(", ") || "none"}`);
  console.log("");

  await mongoose.disconnect();
  console.log("🔌  Disconnected from MongoDB\n");
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});

