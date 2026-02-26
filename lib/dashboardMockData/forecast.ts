import type { ForecastData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateForecastData(): ForecastData {
  const skus = ["SKU-A1", "SKU-B2", "SKU-C3", "SKU-D4", "SKU-E5", "SKU-F6"];
  const baseDemand = r(800, 1200);

  const demandForecast = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      demand: Math.round(baseDemand * (0.9 + Math.sin(i / 7) * 0.2)),
      confidence: r(75, 98),
    };
  });

  return {
    demandForecast,
    skuConfidence: skus.map((sku) => ({
      sku,
      confidence: r(70, 95),
    })),
    stockOutRisk: skus.map((sku) => ({
      sku,
      risk: r(5, 45),
    })).sort((a, b) => b.risk - a.risk),
    productionAllocation: skus.map((sku) => ({
      sku,
      suggested: Math.round(r(500, 2000)),
      reason: ["Demand spike", "Seasonality", "Low stock", "Scheme calendar", "Regional event"][Math.floor(r(0, 4.99))],
    })),
  };
}
