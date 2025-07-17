import { Request, Response } from "express";
import { registerUser, loginUser, guestLogin } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    await registerUser(username, password);
    res.json({ message: "Registration successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const guest = (req: Request, res: Response) => {
  const token = guestLogin();
  res.json({ token });
};
 
