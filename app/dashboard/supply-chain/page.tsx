"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { SupplyChainData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export default function SupplyChainPage() {
  const [data, setData] = useState<SupplyChainData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/supply-chain");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-accent">
        Loading...
      </div>
    );
  }

  const invTrend = data.inventoryDaysTrend.map((v, i) => ({ month: `M${i + 1}`, value: v }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Inventory Days Trend
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={invTrend}>
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#00D4FF" fill="url(#invGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Cash Conversion Cycle
        </h3>
        <div className="text-3xl font-bold text-accent">
          <AnimatedCounter value={data.cashConversionCycle} format="days" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Credit Exposure Heatmap
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data.creditExposure.map((d) => (
            <div
              key={d.distributor}
              className={`p-3 rounded-xl border ${
                d.risk === "high"
                  ? "border-red-500/50 bg-red-500/10"
                  : d.risk === "medium"
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-white/10 bg-white/5"
              }`}
            >
              <div className="text-sm font-medium">{d.distributor}</div>
              <div className="text-accent font-bold">₹{(d.exposure / 100).toFixed(1)} Cr</div>
              <div className="text-[10px] text-gray-500 uppercase">{d.risk}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Payment Delay Risk Map
        </h3>
        <div className="space-y-2">
          {data.paymentDelays.map((p) => (
            <div
              key={p.region}
              className={`flex justify-between p-2 rounded-lg ${
                p.risk === "high" ? "bg-red-500/10" : "bg-white/5"
              }`}
            >
              <span>{p.region}</span>
              <span className="font-bold">{Math.round(p.avgDays)}d</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Raw Material Price Impact
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.rawMaterialPrices} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="material" width={80} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                {data.rawMaterialPrices.map((_, i) => (
                  <Cell
                    key={i}
                    fill={data.rawMaterialPrices[i].change >= 0 ? "#EF4444" : "#22C55E"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
