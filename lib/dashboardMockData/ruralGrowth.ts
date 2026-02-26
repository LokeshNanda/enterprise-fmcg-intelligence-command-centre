import type { RuralGrowthData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateRuralGrowthData(): RuralGrowthData {
  const districts = [
    "Bihar Rural", "UP East", "MP Central", "Rajasthan West",
    "Odisha Coastal", "Jharkhand", "Chhattisgarh", "Assam Valley",
    "West Bengal Rural", "AP Rural", "Karnataka Rural",
  ];

  return {
    districtPenetration: districts.map((d) => ({
      district: d,
      penetration: r(15, 65),
      growth: r(5, 35),
    })),
    growthVsCompetitor: districts.map((d) => ({
      district: d,
      ourGrowth: r(8, 30),
      competitorGrowth: r(3, 20),
    })),
    retailerDensity: districts.map((d) => ({
      district: d,
      density: r(50, 400),
    })),
    expansionOpportunity: districts.map((d) => ({
      district: d,
      score: r(60, 95),
      potential: r(100, 500),
    })).sort((a, b) => b.score - a.score),
  };
}
