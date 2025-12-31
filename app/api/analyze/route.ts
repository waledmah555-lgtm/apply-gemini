import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. FORCE DYNAMIC: This tells Next.js "Don't try to build this, just run it when called"
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // 2. SAFETY CHECK: If the key is missing, fail gracefully (prevents build crashes)
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI Key");
      // During build, this might happen, so we return a dummy response to keep the build alive
      return NextResponse.json({ error: "Server Misconfiguration" }, { status: 500 });
    }

    // 3. Initialize OpenAI INSIDE the function (prevents connection attempts during build)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 4. Safely parse the body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
    }

    const { role, experience, country, resume } = body;

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the resume content:\n${resume}` },
      ],
      response_format: { type: "json_object" },
    });

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
