import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// CRITICAL FIX: Tell Next.js this route is dynamic and should not be pre-built
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Check if the key exists before running
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API Key is missing on the server." },
        { status: 500 }
      );
    }

    // Initialize OpenAI *inside* the request to be safe
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 1. Get data from the frontend
    const body = await req.json();
    const { role, experience, country, resume } = body;

    // 2. The System Prompt
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
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the resume content:\n${resume}` },
      ],
      response_format: { type: "json_object" },
    });

    // 4. Send the result back
    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || "{}");
    
    return NextResponse.json(result);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze profile." },
      { status: 500 }
    );
  }
}
