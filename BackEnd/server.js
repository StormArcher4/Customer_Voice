const express = require("express");
const cors = require("cors");   //It controls if and how a web page from one domain can talk to resources on another domain.
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();

const app = express();

// IMPORTANT: CORS must come BEFORE other middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json()); // saving data in req.body as JSON
app.use(express.urlencoded({ extended: true })); // turns forms data into json objects

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes AFTER middleware setup
const feedbackRoutes = require("./routes/feedback");
const imageRoutes = require("./routes/images");
const pageBackgroundRoutes = require('./routes/pagebackgrounds');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/feedback_db";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// API routes
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/page-backgrounds", pageBackgroundRoutes);

// simple route for testing
app.get("/", (req, res) => {
  res.send("Server is running 🎯");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("⚠️ Internal error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});


//Starts the server listening for incoming requests.
// Use the PORT environment variable or default to 5000:

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});