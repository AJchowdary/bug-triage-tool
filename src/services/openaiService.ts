import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function triageBug(description: string, codeContext?: string) {
  const systemPrompt = `
You are a senior software engineer and code review expert.

Respond ONLY with a STRICT valid JSON object with EXACTLY these fields:

{
  "category": string,
  "priority": string,
  "bug_explanation": string,
  "suggested_fixes": string,
  "fixed_code": string,
  "improvement_suggestions": string
}

NO markdown, no explanations, no extra text.
If no code snippet is given, set "fixed_code" to an empty string.
`;

  const userPrompt = `
Bug Description:
${description}

${codeContext ? `Code Snippet:\n${codeContext}` : "No code snippet provided."}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt.trim() },
    ],
    temperature: 0,
    max_tokens: 1500,
  });

  const rawResponse = response.choices?.[0]?.message?.content ?? "";
  console.log("Raw AI response:", rawResponse);

  try {
    const parsed = JSON.parse(rawResponse.trim());
    return parsed;
  } catch (e) {
    console.error("Failed to parse AI JSON response", e);
    return {
      category: "ParsingError",
      priority: "Unknown",
      bug_explanation: "AI response was not valid JSON.",
      suggested_fixes: rawResponse,
      fixed_code: "",
      improvement_suggestions: "",
    };
  }
}





 
