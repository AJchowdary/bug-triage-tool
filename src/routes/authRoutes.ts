import express from "express";

const router = express.Router();

// Simple in-memory user storage (not for production)
const users: { [email: string]: string } = {};

// Signup route
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  if (users[email]) {
    return res.status(400).json({ error: "User already exists" });
  }

  users[email] = password;

  return res.json({ token: `mock-token-${Date.now()}` });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  if (users[email] !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({ token: `mock-token-${Date.now()}` });
});

export default router;

 
