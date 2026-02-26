import type { MarketingImpactData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateMarketingImpactData(): MarketingImpactData {
  const campaigns = ["Summer Blast", "Festival Sale", "New Launch", "Regional Push"];
  const regions = ["North", "South", "East", "West"];
  const channels = ["TV", "Digital", "Print", "OOH", "Influencer"];
  const influencers = ["Influencer A", "Influencer B", "Influencer C", "Influencer D"];

  return {
    campaignExposure: campaigns.flatMap((c) =>
      regions.map((region) => ({
        campaign: c,
        region,
        reach: Math.round(r(100, 500) * 1000),
      }))
    ),
    salesUplift: campaigns.map((c) => ({
      campaign: c,
      uplift: r(5, 35),
    })),
    mediaMix: channels.map((ch) => ({
      channel: ch,
      spend: r(50, 300),
      roi: r(1.2, 4.5),
    })),
    influencerROI: influencers.map((i) => ({
      name: i,
      roi: r(2, 6),
      reach: Math.round(r(50, 200) * 1000),
    })),
    channelPerformance: [
      { channel: "TV", digital: r(20, 40), offline: r(60, 85) },
      { channel: "Digital", digital: r(70, 95), offline: r(10, 30) },
      { channel: "Print", digital: r(15, 35), offline: r(65, 90) },
      { channel: "OOH", digital: r(10, 25), offline: r(75, 95) },
      { channel: "Influencer", digital: r(85, 98), offline: r(5, 20) },
    ],
  };
}
