import type { RetailFootwearData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateRetailFootwearData(): RetailFootwearData {
  const stores = ["Store A", "Store B", "Store C", "Store D", "Store E", "Store F", "Store G", "Store H"];
  const stages = ["Footfall", "Browse", "Try", "Purchase"];
  const skus = ["RUN-001", "CAS-002", "SPT-003", "FRM-004", "KID-005", "WOM-006"];
  const buckets = ["0-30 days", "31-60 days", "61-90 days", "90+ days"];
  const regions = ["North", "South", "East", "West"];

  return {
    storeRevenue: stores.map((store) => ({
      store,
      revenue: r(50, 350),
      footfall: r(200, 1200),
    })),
    footfallConversion: stages.map((stage, i) => ({
      stage,
      count: Math.round(r(500, 2000) * (1 - i * 0.2)),
      rate: r(60, 95),
    })),
    skuSellThrough: skus.map((sku) => ({
      sku,
      sellThrough: r(65, 95),
      target: 85,
    })),
    inventoryAging: buckets.map((bucket) => ({
      bucket,
      units: Math.round(r(50, 500)),
      value: r(5000, 80000),
    })),
    regionalDemand: regions.map((region) => ({
      region,
      demand: r(100, 500),
      trend: r(-5, 20),
    })),
  };
}
