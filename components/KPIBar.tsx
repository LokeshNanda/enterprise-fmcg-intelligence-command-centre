"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import type { DashboardData } from "@/lib/types";

const KPI_CONFIG = [
  {
    key: "revenue" as const,
    label: "Global Revenue",
    format: "currency" as const,
    getValue: (d: DashboardData) => d.revenue,
    accent: true,
  },
  {
    key: "salesGrowth" as const,
    label: "Sales Growth",
    format: "percent" as const,
    getValue: (d: DashboardData) => d.salesGrowth,
    accent: true,
  },
  {
    key: "distributionReach" as const,
    label: "Distribution Reach",
    format: "percent" as const,
    getValue: (d: DashboardData) => d.distributionReach,
  },
  {
    key: "productionEfficiency" as const,
    label: "Production Efficiency",
    format: "percent" as const,
    getValue: (d: DashboardData) => d.productionEfficiency,
  },
  {
    key: "workingCapitalDays" as const,
    label: "Working Capital Days",
    format: "days" as const,
    getValue: (d: DashboardData) => d.workingCapitalDays,
  },
  {
    key: "enterpriseRiskIndex" as const,
    label: "Enterprise Risk Index",
    format: "number" as const,
    getValue: (d: DashboardData) => d.enterpriseRiskIndex,
    isRisk: true,
  },
];

interface KPIBarProps {
  data: DashboardData;
}

export function KPIBar({ data }: KPIBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-4 justify-between px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
    >
      {KPI_CONFIG.map((config, i) => {
        const value = config.getValue(data);
        const isCritical = config.isRisk && value > 4;
        const isWarning = config.isRisk && value > 3 && value <= 4;

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex flex-col items-center min-w-[120px] group"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              {config.label}
            </span>
            <span
              className={`text-xl font-bold tabular-nums transition-shadow duration-300 ${
                isCritical
                  ? "text-red-400 shadow-glow-critical animate-pulse-slow"
                  : isWarning
                    ? "text-amber-400 shadow-glow-warning"
                    : config.accent
                      ? "text-accent shadow-glow-sm group-hover:shadow-glow"
                      : "text-gray-100"
              }`}
            >
              <AnimatedCounter
                value={value}
                format={config.format}
                className="inline-block"
              />
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
