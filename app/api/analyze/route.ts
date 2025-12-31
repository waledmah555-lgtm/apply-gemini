import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Get data from the frontend
    const { role, experience, country, resume } = await req.json();

    // 2. The System Prompt (The instructions we agreed on)
    const systemPrompt = `
      You are an honest, senior career mentor specializing in the GCC (Gulf Cooperation Council) job market.
      Analyze the candidate's profile for the role of "${role}" in "${country}" with ${experience} years experience.
      
      Be realistic. If the resume is weak, say so.
      Return a strict JSON object with this structure:
      {
        "score": number (0-100),
        "summary": "2 sentences on their standing.",
        "strengths": ["string", "string", "string"],
        "gaps": ["string", "string", "string"],
        "action_plan": ["string", "string", "string"]
      }
    `;

    // 3. Call the AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective and fast
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the resume content:\n${resume}` },
      ],
      response_format: { type: "json_object" }, // Forces valid JSON
    });

    // 4. Send the result back to the frontend
    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to analyze profile." },
      { status: 500 }
    );
  }
}
