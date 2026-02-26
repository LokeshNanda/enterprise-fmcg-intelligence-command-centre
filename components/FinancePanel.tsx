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
import type { FinanceData } from "@/lib/types";

interface FinancePanelProps {
  data: FinanceData;
}

export function FinancePanel({ data }: FinancePanelProps) {
  const chartData = data.workingCapitalTrend.map((v, i) => ({
    month: `M${i + 1}`,
    value: v,
  }));

  const isCreditHigh = data.creditRiskIndex > 3.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:border-accent/20 transition-colors h-full flex flex-col"
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Finance & Liquidity
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <span className="text-[10px] text-gray-500 block">Cash Conversion Cycle</span>
          <span className="font-bold text-accent tabular-nums">
            <AnimatedCounter value={data.cashConversionCycle} format="days" />
          </span>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block">Inventory Days</span>
          <span className="font-bold text-accent tabular-nums">
            <AnimatedCounter value={data.inventoryDays} format="days" />
          </span>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block">Credit Risk Index</span>
          <span
            className={`font-bold tabular-nums ${
              isCreditHigh ? "text-amber-400" : "text-accent"
            }`}
          >
            <AnimatedCounter value={data.creditRiskIndex} format="number" />
          </span>
        </div>
      </div>

      <div className="h-20 shrink-0">
        <span className="text-[10px] uppercase text-gray-500 block mb-1">
          Working Capital Trend
        </span>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
            <Tooltip
              contentStyle={{
                background: "rgba(10, 15, 28, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}Cr`, ""]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#finGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
