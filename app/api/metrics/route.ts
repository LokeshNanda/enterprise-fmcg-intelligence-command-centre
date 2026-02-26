import { NextResponse } from "next/server";
import { generateMockData } from "@/lib/mockData";
import { generateAISummary } from "@/lib/aiSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = generateMockData();
  data.aiInsights = generateAISummary(data);
  return NextResponse.json(data);
}
