import type { DashboardData } from "./types";

export function generateAISummary(data: DashboardData): string[] {
  const insights: string[] = [];

  if (data.salesGrowth > 14) {
    insights.push(`Sales momentum strong at ${data.salesGrowth.toFixed(1)}% YoY — above target.`);
  } else if (data.salesGrowth < 10) {
    insights.push(`Sales growth at ${data.salesGrowth.toFixed(1)}% — consider promotional push in underperforming regions.`);
  }

  if (data.enterpriseRiskIndex > 4) {
    insights.push(`Enterprise risk elevated (${data.enterpriseRiskIndex.toFixed(1)}/10) — review supply chain and credit exposure.`);
  } else if (data.enterpriseRiskIndex < 3) {
    insights.push(`Risk profile healthy — favourable conditions for expansion.`);
  }

  if (data.manufacturing.oee > 85) {
    insights.push(`OEE at ${data.manufacturing.oee.toFixed(1)}% — production efficiency above benchmark.`);
  } else if (data.manufacturing.downtime > 5) {
    insights.push(`Downtime at ${data.manufacturing.downtime.toFixed(1)}% — prioritise maintenance and capacity planning.`);
  }

  if (data.distributionReach > 85) {
    insights.push(`Distribution reach ${data.distributionReach.toFixed(1)}% — strong penetration in target markets.`);
  }

  if (data.workingCapitalDays > 50) {
    insights.push(`Working capital at ${data.workingCapitalDays} days — focus on receivables and inventory optimisation.`);
  }

  if (data.sales.promotionROI > 4) {
    insights.push(`Promotion ROI at ${data.sales.promotionROI.toFixed(1)}x — campaigns performing well.`);
  }

  const topState = data.states.reduce((a, b) =>
    a.revenue > b.revenue ? a : b
  );
  insights.push(`${topState.name} leads revenue contribution — monitor regional mix.`);

  return insights.slice(0, 4);
}
