import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bugTriageRoutes from "./routes/bugTriage";
import authRoutes from "./routes/authRoutes";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Optional: Warn if key is missing
if (!OPENAI_API_KEY) {
  console.warn("❌ OPENAI_API_KEY is not defined in your .env file.");
}

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log incoming requests
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", bugTriageRoutes);

// Root route
app.get("/", (_req, res) => {
  res.send("🛠️ Bug Triage Tool API is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});




 
