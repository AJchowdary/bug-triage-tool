import { Request, Response } from "express";
import { triageBug } from "../services/openaiService";

export const handleBugTriage = async (req: Request, res: Response) => {
  const { description, codeContext } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Bug description is required." });
  }

  try {
    const result = await triageBug(description, codeContext);
    res.json(result);
  } catch (error) {
    console.error("Error in bug triage:", error);
    res.status(500).json({ error: "Bug triage failed." });
  }
};


 
