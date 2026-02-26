import OpenAI from "openai";
import type { DashboardData } from "./types";
import { generateAISummary } from "./aiSummary";

/**
 * Generate AI insights using OpenAI when API key is available.
 * Falls back to rule-based insights otherwise.
 * @param userKey - Optional API key from user (e.g. from localStorage)
 */
export async function generateAISummaryWithLLM(
  data: DashboardData,
  userKey?: string
): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY?.trim() || userKey?.trim();
  if (!apiKey) {
    return generateAISummary(data);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const prompt = buildPrompt(data);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an executive analyst for a large FMCG conglomerate. Generate 3-4 concise, actionable bullet-point insights from the dashboard data. Be specific with numbers. Use British English spelling. Keep each insight to one sentence. Focus on what matters to C-suite: risks, opportunities, and recommended actions.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) return generateAISummary(data);

    const insights = text
      .split(/\n+/)
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 10)
      .slice(0, 4);

    return insights.length > 0 ? insights : generateAISummary(data);
  } catch (err) {
    console.warn("OpenAI AI summary failed, using rule-based fallback:", err);
    return generateAISummary(data);
  }
}

function buildPrompt(data: DashboardData): string {
  const topState = data.states.reduce((a, b) =>
    a.revenue > b.revenue ? a : b
  );
  const topDealer = data.sales.topDealers[0];
  const topSku = data.sales.skuMomentum[0];

  return `Dashboard data (JSON):

{
  "revenue_cr": ${data.revenue},
  "sales_growth_pct": ${data.salesGrowth},
  "distribution_reach_pct": ${data.distributionReach},
  "production_efficiency_pct": ${data.productionEfficiency},
  "working_capital_days": ${data.workingCapitalDays},
  "enterprise_risk_index": ${data.enterpriseRiskIndex},
  "manufacturing": {
    "oee": ${data.manufacturing.oee},
    "demand_vs_production": ${data.manufacturing.demandVsProduction},
    "downtime_pct": ${data.manufacturing.downtime},
    "raw_material_volatility": ${data.manufacturing.rawMaterialVolatility},
    "energy_efficiency": ${data.manufacturing.energyEfficiency}
  },
  "sales": {
    "promotion_roi": ${data.sales.promotionROI},
    "top_dealer": "${topDealer?.name}" (₹${topDealer?.sales ?? 0} Cr),
    "top_sku_momentum": "${topSku?.sku}" (${topSku?.growth ?? 0}% growth)
  },
  "finance": {
    "cash_conversion_cycle_days": ${data.finance.cashConversionCycle},
    "inventory_days": ${data.finance.inventoryDays},
    "credit_risk_index": ${data.finance.creditRiskIndex}
  },
  "top_state": "${topState.name}" (₹${(topState.revenue / 1000).toFixed(1)} Cr, ${topState.growth}% growth, risk ${topState.risk})
}

Generate 3-4 executive insights as bullet points.`;
}
