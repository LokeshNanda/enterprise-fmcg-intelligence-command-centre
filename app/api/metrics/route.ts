import { NextRequest, NextResponse } from "next/server";
import { generateMockData } from "@/lib/mockData";
import { generateAISummaryWithLLM } from "@/lib/aiSummaryOpenAI";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const data = generateMockData();
  const userKey = req.headers.get("x-openai-key")?.trim();
  data.aiInsights = await generateAISummaryWithLLM(data, userKey ?? undefined);
  return NextResponse.json(data);
}
