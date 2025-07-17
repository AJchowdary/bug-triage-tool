import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const prompt = `
You are an expert software engineer and code reviewer.

Your task is to perform a thorough bug triage and code review.

Given a bug description and optional code snippet, return a structured response in the following strict JSON format:

{
  "category": "Short general category for the bug (e.g., 'UI Bug', 'Logic Error', 'Security Flaw')",
  "priority": "Low | Medium | High | Critical",
  "bug_explanation": "Clear explanation of the bug and why it occurs",
  "suggested_fixes": "Step-by-step fix or plan to resolve the bug",
  "fixed_code": "Only if code is provided, return the corrected and improved version",
  "improvement_suggestions": "Optional but helpful suggestions to improve performance, maintainability, or security"
}

If code is not provided, or no bugs are found, clearly state that in the explanation field and set 'fixed_code' to an empty string.

Respond ONLY with valid JSON — do not include markdown formatting or extra text.

---

Bug Description:
${description}

${codeContext ? `Code Snippet:\n${codeContext}` : ""}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4", // you can downgrade to "gpt-3.5-turbo" if needed
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content ?? "{}";

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error, "\nResponse was:\n", text);
    return {
      category: "Unknown",
      priority: "Unknown",
      bug_explanation: "Could not parse response",
      suggested_fixes: "",
      fixed_code: "",
      improvement_suggestions: "",
    };
  }
}

 
