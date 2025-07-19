import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bugTriageRoutes from "./routes/bugTriage";
import authRoutes from "./routes/authRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Warn if API key is missing
if (!OPENAI_API_KEY) {
  console.warn("❌ OPENAI_API_KEY is not defined in your .env file.");
}

// Middleware
app.use(cors());
app.use(express.json()); // Must come BEFORE routes

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Test route to verify JSON body parsing
app.post("/test-json", (req, res) => {
  console.log("Test JSON body:", req.body);
  res.json({ received: req.body });
});

// Application routes
app.use("/api/auth", authRoutes);
app.use("/api", bugTriageRoutes);

// Root route - health check
app.get("/", (_req, res) => {
  res.send("🛠️ Bug Triage Tool API is running.");
});

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Server listening on http://0.0.0.0:${PORT}`);
});







 
