import { NextRequest, NextResponse } from "next/server";
import { generateDashboardData, DASHBOARD_SLUGS } from "@/lib/dashboardMockData";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!DASHBOARD_SLUGS.includes(slug as (typeof DASHBOARD_SLUGS)[number])) {
    return NextResponse.json({ error: "Invalid dashboard slug" }, { status: 404 });
  }

  const data = generateDashboardData(slug as (typeof DASHBOARD_SLUGS)[number]);
  if (!data) {
    return NextResponse.json({ error: "Data generation failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}
