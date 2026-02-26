"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { AnimatedCounter } from "./AnimatedCounter";
import type { SalesData } from "@/lib/types";

interface SalesPanelProps {
  data: SalesData;
}

export function SalesPanel({ data }: SalesPanelProps) {
  const skuChartData = data.skuMomentum.slice(0, 5).map((s) => ({
    name: s.sku.replace("SKU-", ""),
    growth: s.growth,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:border-accent/20 transition-colors h-full flex flex-col"
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Sales & Distribution Momentum
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Promotion ROI</span>
          <span className="font-bold text-accent">
            <AnimatedCounter value={data.promotionROI} format="number" />x
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <span className="text-[10px] uppercase text-gray-500">
          Dealer Leaderboard
        </span>
        {data.topDealers.slice(0, 4).map((d, i) => (
          <div
            key={d.name}
            className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0"
          >
            <span className="text-gray-300 truncate max-w-[120px]">
              {i + 1}. {d.name.split(" ")[0]}
            </span>
            <span className="text-accent font-medium tabular-nums">
              ₹{(d.sales / 1000).toFixed(1)}Cr
            </span>
          </div>
        ))}
      </div>

      <div className="h-20 shrink-0">
        <span className="text-[10px] uppercase text-gray-500 block mb-1">
          SKU Momentum
        </span>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={skuChartData} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" hide domain={["auto", "auto"]} />
            <YAxis
              type="category"
              dataKey="name"
              width={45}
              tick={{ fontSize: 9, fill: "#9CA3AF" }}
            />
            <Bar
              dataKey="growth"
              fill="#00D4FF"
              radius={[0, 4, 4, 0]}
              fillOpacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
