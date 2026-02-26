import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { question, data, openaiApiKey: userKey } = (await req.json()) as {
      question: string;
      data?: Record<string, unknown>;
      openaiApiKey?: string;
    };

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim() || userKey?.trim();
    if (!apiKey) {
      return NextResponse.json({
        answer: "OpenAI API key is not configured. Add OPENAI_API_KEY to your .env file, or enter your key in the Ask Your Data panel (click the key icon) to enable natural language queries.",
      });
    }

    const openai = new OpenAI({ apiKey });
    const dataContext = data
      ? `\n\nCurrent dashboard data (JSON):\n${JSON.stringify(data, null, 2)}`
      : "\n\nNo specific data was provided. Answer based on general FMCG enterprise context.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an executive analyst for a large FMCG conglomerate. The user is asking questions about their enterprise dashboard data. Answer concisely and specifically. Use numbers from the data when relevant. If the data is provided, reference it. Keep responses to 2-4 sentences unless the user asks for more detail. Use British English spelling.`,
        },
        {
          role: "user",
          content: `Question: ${question.trim()}${dataContext}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? "Unable to generate a response.";
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Ask API error:", err);
    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
      { status: 500 }
    );
  }
}
