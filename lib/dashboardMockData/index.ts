import type {
  FMCGSalesData,
  DairyColdChainData,
  RetailFootwearData,
  SupplyChainData,
  MarketingImpactData,
  ForecastData,
  RuralGrowthData,
} from "@/lib/types";
import { generateFMCGSalesData } from "./fmcgSales";
import { generateDairyColdChainData } from "./dairyColdChain";
import { generateRetailFootwearData } from "./retailFootwear";
import { generateSupplyChainData } from "./supplyChain";
import { generateMarketingImpactData } from "./marketingImpact";
import { generateForecastData } from "./forecast";
import { generateRuralGrowthData } from "./ruralGrowth";

export const DASHBOARD_SLUGS = [
  "fmcg-sales",
  "dairy-cold-chain",
  "retail-footwear",
  "supply-chain",
  "marketing-impact",
  "forecast",
  "rural-growth",
] as const;

export type DashboardSlug = (typeof DASHBOARD_SLUGS)[number];

const generators: Record<
  DashboardSlug,
  () =>
    | FMCGSalesData
    | DairyColdChainData
    | RetailFootwearData
    | SupplyChainData
    | MarketingImpactData
    | ForecastData
    | RuralGrowthData
> = {
  "fmcg-sales": generateFMCGSalesData,
  "dairy-cold-chain": generateDairyColdChainData,
  "retail-footwear": generateRetailFootwearData,
  "supply-chain": generateSupplyChainData,
  "marketing-impact": generateMarketingImpactData,
  forecast: generateForecastData,
  "rural-growth": generateRuralGrowthData,
};

export function generateDashboardData(slug: DashboardSlug) {
  const fn = generators[slug];
  if (!fn) return null;
  return fn();
}
