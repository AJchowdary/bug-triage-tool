import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const systemPrompt = `
You are a senior software engineer and code review expert.

Your ONLY job is to read the bug description and optional code snippet, then output a STRICTLY VALID JSON object with EXACTLY these keys:

{
  "category": string,
  "priority": string,
  "bug_explanation": string,
  "suggested_fixes": string,
  "fixed_code": string,
  "improvement_suggestions": string
}

RULES:
- Return ONLY the JSON object, no extra text or markdown.
- If no code is provided, "fixed_code" should be an empty string.
- Be concise and clear.
- Do not explain or apologize outside the JSON.
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




 
