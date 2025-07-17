import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bugTriageRoutes from "./routes/bugTriage";
import authRoutes from "./routes/authRoutes"; // ✅ Single import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);     // ✅ Auth routes mounted once
app.use("/api", bugTriageRoutes);     // ✅ All triage routes under /api

// Root route
app.get("/", (_req, res) => {
  res.send("🛠️ Bug Triage Tool API is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});



 
