import type { DashboardData } from "./types";

const INDIAN_STATES = [
  "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Gujarat",
  "West Bengal", "Rajasthan", "Andhra Pradesh", "Telangana", "Kerala",
  "Madhya Pradesh", "Punjab", "Haryana", "Delhi", "Bihar",
  "Odisha", "Assam", "Chhattisgarh", "Jharkhand", "Uttarakhand",
  "Himachal Pradesh", "Goa", "Tripura", "Meghalaya", "Manipur",
  "Nagaland", "Sikkim", "Mizoram", "Arunachal Pradesh", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh"
];

function randomInRange(min: number, max: number, variance = 0.15): number {
  const base = min + Math.random() * (max - min);
  const v = 1 + (Math.random() - 0.5) * variance;
  return Math.round(base * v * 100) / 100;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockData(): DashboardData {
  const revenue = randomInRange(42000, 52000);
  const salesGrowth = randomInRange(8, 18);
  const distributionReach = randomInRange(72, 92);
  const productionEfficiency = randomInRange(78, 95);
  const workingCapitalDays = randomInt(35, 65);
  const enterpriseRiskIndex = randomInRange(2.2, 4.8);

  const states = INDIAN_STATES.map((name) => ({
    name,
    revenue: randomInRange(200, 8000),
    growth: randomInRange(-5, 25),
    risk: randomInRange(1.5, 6.5),
  }));

  const manufacturing = {
    oee: randomInRange(72, 88),
    demandVsProduction: randomInRange(92, 108),
    downtime: randomInRange(2, 8),
    rawMaterialVolatility: randomInRange(12, 35),
    energyEfficiency: randomInRange(78, 94),
  };

  const dealerNames = [
    "Metro Wholesale Pvt Ltd", "Super Distributors India", "Regional Hub North",
    "FastTrack Logistics", "Prime Retail Chain", "National Distributors",
    "Mega Mart Supplies", "Elite Trading Co", "Swift Distribution",
    "Pan India Retail"
  ];

  const skuNames = [
    "SKU-A1 Premium", "SKU-B2 Standard", "SKU-C3 Economy",
    "SKU-D4 Deluxe", "SKU-E5 Bulk", "SKU-F6 Compact",
    "SKU-G7 Family", "SKU-H8 Single", "SKU-I9 Value",
    "SKU-J0 Pro"
  ];

  const topDealers = dealerNames.slice(0, randomInt(5, 8)).map((name, i) => ({
    name,
    sales: randomInRange(1200, 8500),
  })).sort((a, b) => b.sales - a.sales);

  const skuMomentum = skuNames.slice(0, randomInt(5, 8)).map((sku) => ({
    sku,
    growth: randomInRange(-8, 32),
  })).sort((a, b) => b.growth - a.growth);

  const finance = {
    cashConversionCycle: randomInt(28, 52),
    inventoryDays: randomInt(22, 45),
    creditRiskIndex: randomInRange(1.8, 4.2),
    workingCapitalTrend: Array.from({ length: 12 }, () =>
      randomInRange(800, 1200)
    ),
  };

  return {
    revenue,
    salesGrowth,
    distributionReach,
    productionEfficiency,
    workingCapitalDays,
    enterpriseRiskIndex,
    states,
    manufacturing,
    sales: {
      topDealers,
      skuMomentum,
      promotionROI: randomInRange(2.2, 5.8),
    },
    finance,
    aiInsights: [], // Filled by aiSummary
  };
}
