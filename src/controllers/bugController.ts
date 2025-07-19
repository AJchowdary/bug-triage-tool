import { Request, Response } from "express";
import { triageBug } from "../services/openaiService";

export const handleBugTriage = async (req: Request, res: Response) => {
  const description = req.body.description || req.body.bug_explanation;
  const codeContext = req.body.codeContext || "";

  if (!description || typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ error: "Bug description is required." });
  }

  try {
    const triageResult = await triageBug(description, codeContext);
    return res.json(triageResult);
  } catch (error) {
    console.error("Error in bug triage:", error);
    return res.status(500).json({ error: "Bug triage failed." });
  }
};




 
