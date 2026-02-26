import type { FMCGSalesData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateFMCGSalesData(): FMCGSalesData {
  const regions = ["North", "South", "East", "West", "Central"];
  const channels = ["Modern Trade", "General Trade", "E-commerce", "Rural"];
  const schemes = ["BOGO", "Cashback", "Bulk Discount", "New Launch"];
  const skus = ["SKU-A1", "SKU-B2", "SKU-C3", "SKU-D4", "SKU-E5", "SKU-F6", "SKU-G7", "SKU-H8"];

  return {
    regionSales: regions.map((region) => ({
      region,
      sales: r(800, 4500),
      growth: r(-5, 25),
    })),
    skuMomentum: skus.map((sku) => ({
      sku,
      growth: r(-8, 35),
      volume: r(1000, 8000),
    })).sort((a, b) => b.growth - a.growth),
    retailChannelSplit: channels.map((channel) => ({
      channel,
      share: r(15, 35),
      growth: r(2, 18),
    })),
    schemePerformance: schemes.map((scheme) => ({
      scheme,
      uplift: r(5, 45),
      roi: r(1.5, 5.5),
    })),
    ruralVsUrban: {
      rural: r(18, 28),
      urban: r(8, 15),
    },
    competitorPricing: skus.slice(0, 5).map((sku) => ({
      sku,
      ours: r(99, 299),
      competitor: r(89, 319),
    })),
  };
}
