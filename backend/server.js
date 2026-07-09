// Main entry point for the Artist Portfolio backend API

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/security", require("./routes/security"));
app.use("/api/activity", require("./routes/activity"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/artworks", require("./routes/artworks"));
app.use("/api/inquiries", require("./routes/inquiries"));
app.use("/api/settings", require("./routes/settings"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Artist Portfolio API is running",
    env: process.env.NODE_ENV,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", errors: [] });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error",
    errors: [],
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
};

startServer();
