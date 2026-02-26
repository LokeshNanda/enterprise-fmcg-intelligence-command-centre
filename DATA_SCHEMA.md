# Dashboard Data Schema

{
  revenue: number,
  salesGrowth: number,
  distributionReach: number,
  productionEfficiency: number,
  workingCapitalDays: number,
  enterpriseRiskIndex: number,

  states: [
    {
      name: string,
      revenue: number,
      growth: number,
      risk: number
    }
  ],

  manufacturing: {
    oee: number,
    demandVsProduction: number,
    downtime: number,
    rawMaterialVolatility: number,
    energyEfficiency: number
  },

  sales: {
    topDealers: [
      { name: string, sales: number }
    ],
    skuMomentum: [
      { sku: string, growth: number }
    ],
    promotionROI: number
  },

  finance: {
    cashConversionCycle: number,
    inventoryDays: number,
    creditRiskIndex: number,
    workingCapitalTrend: number[]
  },

  aiInsights: string[]
}