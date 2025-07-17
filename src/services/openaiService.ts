import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageBug(description: string, codeContext?: string) {
  const prompt = `
You are a senior software engineer and code bug triage expert.

Given a bug description and (optional) code snippet, return only a valid JSON with the following structure:

{
  "category": "<short label like 'Logic Error', 'Syntax Error', 'UI Bug', etc.>",
  "priority": "<Low | Medium | High | Critical>",
  "bug_explanation": "<What is the bug and why it happens>",
  "suggested_fixes": "<Steps to fix the bug>",
  "fixed_code": "<Fixed version of the code, if code is provided. Else, empty string>",
  "improvement_suggestions": "<How can the code be improved in general>"
}

Only return this JSON object. Do NOT return markdown, commentary, or explanation.

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


 
