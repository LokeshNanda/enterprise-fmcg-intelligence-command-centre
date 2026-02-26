"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { FMCGSalesData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;
const CHART_COLORS = ["#00D4FF", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];

export default function FMCGSalesPage() {
  const [data, setData] = useState<FMCGSalesData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/fmcg-sales");
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

  const pieData = data.retailChannelSplit.map((c, i) => ({
    name: c.channel,
    value: c.share,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          SKU Momentum Chart
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.skuMomentum.slice(0, 6)}>
              <XAxis dataKey="sku" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="growth" fill="#00D4FF" radius={[4, 4, 0, 0]} />
            </BarChart>
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
          Promotion Uplift Visualizer
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.schemePerformance}>
              <XAxis dataKey="scheme" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="uplift" fill="#00D4FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roi" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
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
          Retail Channel Comparison
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieData[i].color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Rural vs Urban Growth Split
        </h3>
        <div className="flex gap-6">
          <div className="flex-1 p-4 rounded-xl bg-accent/10 border border-accent/30">
            <div className="text-xs text-gray-400">Rural Growth</div>
            <div className="text-2xl font-bold text-accent">
              <AnimatedCounter value={data.ruralVsUrban.rural} format="percent" />
            </div>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-gray-400">Urban Growth</div>
            <div className="text-2xl font-bold text-gray-200">
              <AnimatedCounter value={data.ruralVsUrban.urban} format="percent" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Competitor Pricing Overlay
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.competitorPricing}>
              <XAxis dataKey="sku" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="ours" fill="#00D4FF" name="Ours" radius={[4, 4, 0, 0]} />
              <Bar dataKey="competitor" fill="#6B7280" name="Competitor" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
