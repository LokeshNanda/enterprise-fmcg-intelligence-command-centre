"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AnimatedCounter } from "./AnimatedCounter";
import type { ManufacturingData } from "@/lib/types";

interface ManufacturingPanelProps {
  data: ManufacturingData;
}

const METRICS = [
  { key: "oee", label: "OEE", format: "percent" as const },
  { key: "demandVsProduction", label: "Production vs Demand", format: "percent" as const },
  { key: "downtime", label: "Downtime", format: "percent" as const },
  { key: "rawMaterialVolatility", label: "Raw Material Volatility", format: "percent" as const },
  { key: "energyEfficiency", label: "Energy Efficiency", format: "percent" as const },
];

export function ManufacturingPanel({ data }: ManufacturingPanelProps) {
  const chartData = METRICS.map((m, i) => ({
    name: m.label.slice(0, 8),
    value: data[m.key as keyof ManufacturingData] as number,
    fill: `rgba(0, 212, 255, ${0.2 + (i / METRICS.length) * 0.5})`,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:border-accent/20 transition-colors h-full flex flex-col"
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Manufacturing Intelligence
      </h3>
      <div className="space-y-3 mb-4">
        {METRICS.map((m) => {
          const value = data[m.key as keyof ManufacturingData] as number;
          const isWarning = m.key === "downtime" && value > 5;
          const isWarning2 = m.key === "rawMaterialVolatility" && value > 25;
          return (
            <div key={m.key} className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{m.label}</span>
              <span
                className={`font-bold tabular-nums ${
                  isWarning || isWarning2 ? "text-amber-400" : "text-accent"
                }`}
              >
                <AnimatedCounter value={value} format="percent" />
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-24 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="mfgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "rgba(10, 15, 28, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(v: number) => [`${v.toFixed(1)}%`, ""]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#mfgGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
