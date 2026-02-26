import type { SupplyChainData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateSupplyChainData(): SupplyChainData {
  const distributors = ["Dist A", "Dist B", "Dist C", "Dist D", "Dist E", "Dist F"];
  const regions = ["North", "South", "East", "West"];
  const materials = ["Milk Powder", "Palm Oil", "Sugar", "Packaging", "Flavours"];

  return {
    inventoryDaysTrend: Array.from({ length: 12 }, () => r(25, 55)),
    cashConversionCycle: r(35, 55),
    creditExposure: distributors.map((d) => ({
      distributor: d,
      exposure: r(50, 400),
      risk: r(0, 1) > 0.7 ? "high" : r(0, 1) > 0.4 ? "medium" : "low",
    })),
    paymentDelays: regions.map((region) => ({
      region,
      avgDays: r(15, 45),
      risk: r(0, 1) > 0.6 ? "high" : "low",
    })),
    rawMaterialPrices: materials.map((m) => ({
      material: m,
      price: r(80, 200),
      change: r(-15, 25),
    })),
  };
}
