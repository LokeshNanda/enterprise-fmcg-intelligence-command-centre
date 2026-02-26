import type { DairyColdChainData } from "@/lib/types";

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type RouteStatus = "safe" | "risk" | "spoilage";

export function generateDairyColdChainData(): DairyColdChainData {
  const routes = [
    { from: "Mumbai", to: "Pune" },
    { from: "Delhi", to: "Noida" },
    { from: "Bangalore", to: "Mysore" },
    { from: "Chennai", to: "Coimbatore" },
    { from: "Kolkata", to: "Howrah" },
    { from: "Hyderabad", to: "Secunderabad" },
    { from: "Ahmedabad", to: "Vadodara" },
    { from: "Lucknow", to: "Kanpur" },
  ];

  const statuses: RouteStatus[] = ["safe", "safe", "safe", "risk", "risk", "spoilage"];
  const getStatus = (): RouteStatus => statuses[Math.floor(Math.random() * statuses.length)];

  return {
    routes: routes.map((rte, i) => {
      const status = getStatus();
      const temp = status === "safe" ? r(2, 6) : status === "risk" ? r(6, 10) : r(10, 15);
      return {
        id: `R${i + 1}`,
        from: rte.from,
        to: rte.to,
        temp: Math.round(temp * 10) / 10,
        status,
        lag: Math.round(r(0.5, 4) * 10) / 10,
      };
    }),
    temperatureLogs: Array.from({ length: 20 }, (_, i) => ({
      routeId: `R${(i % 8) + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temp: r(2, 8),
    })),
    spoilageRates: ["North", "South", "East", "West"].map((region) => ({
      region,
      rate: r(0.5, 4.5),
    })),
    distributionLag: routes.map((rte) => ({
      route: `${rte.from}-${rte.to}`,
      hours: r(2, 8),
    })),
  };
}
