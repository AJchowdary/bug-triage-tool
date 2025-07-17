import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const systemPrompt = `
You are a senior software engineer and code review assistant.

You must return a VALID JSON object with exactly these fields:
{
  "category": "Short label (e.g., 'Syntax Error', 'Logic Bug', 'Runtime Issue')",
  "priority": "Low | Medium | High | Critical",
  "bug_explanation": "Explain the bug in simple terms.",
  "suggested_fixes": "Explain step-by-step how to fix the bug.",
  "fixed_code": "Fixed version of the input code. If no code given, return an empty string.",
  "improvement_suggestions": "Suggest ways to improve code performance, structure, or readability."
}

RULES:
- Respond ONLY with a pure JSON object. No markdown, no extra text.
- Make sure all fields are present.
- If code was provided, include the fixed version in 'fixed_code'.
- Keep values short and clear.

Respond strictly as per the JSON format above.
`;

  const userPrompt = `
Bug Description:
${description}

${codeContext ? `Code:\n${codeContext}` : "No code was submitted"}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 1000,
  });

  const rawContent = response.choices?.[0]?.message?.content ?? "{}";

  console.log("Raw AI response:", rawContent);

  try {
    const parsed = JSON.parse(rawContent.trim());
    return parsed;
  } catch (e) {
    console.error("❌ Failed to parse AI JSON. Response was:\n", rawContent);
    return {
      category: "ParsingError",
      priority: "Unknown",
      bug_explanation: "Failed to parse AI output. Likely due to formatting.",
      suggested_fixes: "",
      fixed_code: "",
      improvement_suggestions: "",
    };
  }
}




 
