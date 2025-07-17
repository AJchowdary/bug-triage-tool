import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const prompt = `
You are an expert software engineer specializing in bug triage.

You will receive:
- A short bug description
- An optional code snippet

Your task is to analyze the bug and return only a **valid JSON object** with the following keys:

{
  "category": "Short label for bug type (e.g., 'Syntax Error', 'Logic Bug')",
  "priority": "Low | Medium | High | Critical",
  "bug_explanation": "Explain clearly what the bug is and why it happens.",
  "suggested_fixes": "Explain how the user should fix it, step-by-step.",
  "fixed_code": "Provide a fully corrected version of the code snippet, if one was provided.",
  "improvement_suggestions": "List ways to improve the code in general (e.g., structure, performance, naming, readability)."
}

💡 IMPORTANT:
- Only return the JSON. No extra text.
- If no code snippet is given, set "fixed_code" to an empty string.
- Make sure the JSON is valid and parsable.

Bug Description:
${description}

${codeContext ? `Code Snippet:\n${codeContext}` : "No code provided"}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4", // or gpt-3.5-turbo
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices?.[0]?.message?.content ?? "{}";

  try {
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    console.error("❌ AI response not valid JSON:\n", text);
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


 
