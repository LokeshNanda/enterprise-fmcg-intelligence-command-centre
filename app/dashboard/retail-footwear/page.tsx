"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { RetailFootwearData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export default function RetailFootwearPage() {
  const [data, setData] = useState<RetailFootwearData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/retail-footwear");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Store Revenue Heatmap
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {data.storeRevenue.map((s) => (
            <div
              key={s.store}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30"
            >
              <div className="text-xs font-medium">{s.store}</div>
              <div className="text-accent font-bold">₹{s.revenue.toFixed(0)}L</div>
              <div className="text-[10px] text-gray-500">{Math.round(s.footfall)} footfall</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Footfall vs Conversion Funnel
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.footfallConversion}>
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#00D4FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          SKU Sell-Through Matrix
        </h3>
        <div className="space-y-2">
          {data.skuSellThrough.map((s) => (
            <div key={s.sku} className="flex justify-between items-center">
              <span className="text-sm">{s.sku}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${s.sellThrough}%` }}
                  />
                </div>
                <span
                  className={`font-bold tabular-nums ${
                    s.sellThrough >= s.target ? "text-green-400" : "text-amber-400"
                  }`}
                >
                  <AnimatedCounter value={s.sellThrough} format="percent" />
                </span>
              </div>
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
          Inventory Aging Tracker
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.inventoryAging}>
              <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="units" fill="#00D4FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value" fill="#6B7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Regional Demand Trend Analysis
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.regionalDemand}>
              <XAxis dataKey="region" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="demand" stroke="#00D4FF" strokeWidth={2} />
              <Line type="monotone" dataKey="trend" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
