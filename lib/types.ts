export interface DashboardData {
  revenue: number;
  salesGrowth: number;
  distributionReach: number;
  productionEfficiency: number;
  workingCapitalDays: number;
  enterpriseRiskIndex: number;
  states: StateData[];
  manufacturing: ManufacturingData;
  sales: SalesData;
  finance: FinanceData;
  aiInsights: string[];
}

export interface StateData {
  name: string;
  revenue: number;
  growth: number;
  risk: number;
}

export interface ManufacturingData {
  oee: number;
  demandVsProduction: number;
  downtime: number;
  rawMaterialVolatility: number;
  energyEfficiency: number;
}

export interface SalesData {
  topDealers: { name: string; sales: number }[];
  skuMomentum: { sku: string; growth: number }[];
  promotionROI: number;
}

export interface FinanceData {
  cashConversionCycle: number;
  inventoryDays: number;
  creditRiskIndex: number;
  workingCapitalTrend: number[];
}

// Sub-dashboard types
export interface FMCGSalesData {
  regionSales: { region: string; sales: number; growth: number }[];
  skuMomentum: { sku: string; growth: number; volume: number }[];
  retailChannelSplit: { channel: string; share: number; growth: number }[];
  schemePerformance: { scheme: string; uplift: number; roi: number }[];
  ruralVsUrban: { rural: number; urban: number };
  competitorPricing: { sku: string; ours: number; competitor: number }[];
}

export interface DairyColdChainData {
  routes: { id: string; from: string; to: string; temp: number; status: "safe" | "risk" | "spoilage"; lag: number }[];
  temperatureLogs: { routeId: string; timestamp: string; temp: number }[];
  spoilageRates: { region: string; rate: number }[];
  distributionLag: { route: string; hours: number }[];
}

export interface RetailFootwearData {
  storeRevenue: { store: string; revenue: number; footfall: number }[];
  footfallConversion: { stage: string; count: number; rate: number }[];
  skuSellThrough: { sku: string; sellThrough: number; target: number }[];
  inventoryAging: { bucket: string; units: number; value: number }[];
  regionalDemand: { region: string; demand: number; trend: number }[];
}

export interface SupplyChainData {
  inventoryDaysTrend: number[];
  cashConversionCycle: number;
  creditExposure: { distributor: string; exposure: number; risk: string }[];
  paymentDelays: { region: string; avgDays: number; risk: string }[];
  rawMaterialPrices: { material: string; price: number; change: number }[];
}

export interface MarketingImpactData {
  campaignExposure: { campaign: string; region: string; reach: number }[];
  salesUplift: { campaign: string; uplift: number }[];
  mediaMix: { channel: string; spend: number; roi: number }[];
  influencerROI: { name: string; roi: number; reach: number }[];
  channelPerformance: { channel: string; digital: number; offline: number }[];
}

export interface ForecastData {
  demandForecast: { date: string; demand: number; confidence: number }[];
  skuConfidence: { sku: string; confidence: number }[];
  stockOutRisk: { sku: string; risk: number }[];
  productionAllocation: { sku: string; suggested: number; reason: string }[];
}

export interface RuralGrowthData {
  districtPenetration: { district: string; penetration: number; growth: number }[];
  growthVsCompetitor: { district: string; ourGrowth: number; competitorGrowth: number }[];
  retailerDensity: { district: string; density: number }[];
  expansionOpportunity: { district: string; score: number; potential: number }[];
}
