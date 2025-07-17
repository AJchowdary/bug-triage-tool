import { Request, Response } from "express";
import { triageBug } from "../services/openaiService";

export const handleBugTriage = async (req: Request, res: Response) => {
  const { description, codeContext } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Bug description is required." });
  }

  console.log("Incoming triage request:", { description, codeContext });

  try {
    const result = await triageBug(description, codeContext);
    console.log("Triage result:", result);
    res.json(result);
  } catch (error) {
    console.error("Triage error:", error);
    res.status(500).json({ error: "AI triage failed." });
  }
};

 
