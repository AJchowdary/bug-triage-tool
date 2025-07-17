import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
  username: string;
  passwordHash: string;
}

const users: User[] = []; // In-memory store, replace with DB in prod

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export const registerUser = async (username: string, password: string) => {
  const existingUser = users.find(u => u.username === username);
  if (existingUser) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  return true;
};

export const loginUser = async (username: string, password: string) => {
  const user = users.find(u => u.username === username);
  if (!user) throw new Error("Invalid username or password");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid username or password");

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

export const guestLogin = () => {
  const token = jwt.sign({ guest: true }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};
 
