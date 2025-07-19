import { AddressInfo } from "net";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bugTriageRoutes from "./routes/bugTriage";
import authRoutes from "./routes/authRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4002;
const HOST = "0.0.0.0";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Warn if API key is missing
if (!OPENAI_API_KEY) {
  console.warn("❌ OPENAI_API_KEY is not defined in your .env file.");
}

// ✅ CORS setup - allow Vercel frontend
app.use(cors({
  origin: "https://bug-triage-tool.vercel.app", // Replace with your actual deployed frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());

// Middleware
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

// Start server with proper typings
const server = app.listen(PORT, HOST, () => {
  const address = server.address() as AddressInfo;
  console.log(`✅ Server listening on http://${address.address}:${address.port}`);
});









 
