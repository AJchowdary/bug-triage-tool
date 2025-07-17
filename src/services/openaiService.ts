import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const systemPrompt = `
You are a senior software engineer and expert code reviewer.

Your job is to analyze bug descriptions and optional code snippets and return ONLY a valid JSON object with this exact structure:

{
  "category": "Short label for bug type (e.g., 'Syntax Error', 'Logic Bug', 'Performance Issue')",
  "priority": "Low | Medium | High | Critical",
  "bug_explanation": "Explain clearly what the bug is and why it happens.",
  "suggested_fixes": "Explain how to fix the bug step-by-step.",
  "fixed_code": "Fully corrected version of the original code, if code was provided. Otherwise, leave this as an empty string.",
  "improvement_suggestions": "Extra suggestions to improve the code's structure, readability, performance, or security."
}

⚠️ IMPORTANT RULES:
- Respond ONLY with a **valid JSON object**. No markdown, no explanation, no commentary.
- If no code snippet is provided, return "fixed_code": ""
`;

  const userPrompt = `
Bug Description:
${description}

${codeContext ? `Code Snippet:\n${codeContext}` : "No code provided"}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
  });

  const text = response.choices?.[0]?.message?.content ?? "{}";

  try {
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    console.error("❌ Failed to parse AI JSON response:\n", text);
    return {
      category: "ParseError",
      priority: "Unknown",
      bug_explanation: "Unable to parse AI response.",
      suggested_fixes: "",
      fixed_code: "",
      improvement_suggestions: "",
    };
  }
}



 
