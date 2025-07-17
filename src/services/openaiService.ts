import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const prompt = `
You are an experienced developer triaging bug reports.

Given the following bug description and optional code context, return:
1. Category (UI, Backend, Security, Performance, Other)
2. Priority (Critical, High, Medium, Low)
3. Suggested fix or next step

Bug Description:
${description}

${codeContext ? `Code Context:\n${codeContext}` : ""}

Respond ONLY in this JSON format:
{
  "category": "...",
  "priority": "...",
  "suggested_fix": "..."
}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content ?? "{}";

  try {
    return JSON.parse(text);
  } catch {
    return {
      category: "Unknown",
      priority: "Unknown",
      suggested_fix: "Could not parse response",
    };
  }
}

 
