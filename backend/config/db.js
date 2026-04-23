const mongoose = require("mongoose");

// ── Serverless-safe connection cache ──────────────────────────────────────────
// Vercel serverless: module is re-evaluated on cold starts but the global object
// persists across warm invocations in the same runtime instance. Caching here
// prevents opening a fresh MongoDB connection on every request.
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is in progress, wait for it
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false, // Disable buffering — fail fast if not connected
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected ✅");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset promise so the next call retries the connection
    cached.promise = null;
    console.error("MongoDB connection error ❌", err.message);
    throw err; // Let the caller handle the error (don't process.exit in serverless)
  }

  return cached.conn;
};

module.exports = connectDB;