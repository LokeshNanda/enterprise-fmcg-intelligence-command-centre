"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { RuralGrowthData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export default function RuralGrowthPage() {
  const [data, setData] = useState<RuralGrowthData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/rural-growth");
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
        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Rural District Penetration Map
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.districtPenetration.map((d) => (
            <div
              key={d.district}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30"
            >
              <div className="text-sm font-medium truncate">{d.district}</div>
              <div className="text-accent font-bold">
                <AnimatedCounter value={d.penetration} format="percent" />
              </div>
              <div className="text-[10px] text-gray-500">
                +{d.growth.toFixed(1)}% growth
              </div>
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
          Growth vs Competitor Comparison
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.growthVsCompetitor.slice(0, 8)}>
              <XAxis dataKey="district" tick={{ fontSize: 9, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="ourGrowth" fill="#00D4FF" name="Our Growth" radius={[4, 4, 0, 0]} />
              <Bar dataKey="competitorGrowth" fill="#6B7280" name="Competitor" radius={[4, 4, 0, 0]} />
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
          Retailer Density Analysis
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.retailerDensity.slice(0, 8)}>
              <XAxis dataKey="district" tick={{ fontSize: 9, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="density" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Expansion Opportunity Radar
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.expansionOpportunity.slice(0, 8).map((e) => (
            <div
              key={e.district}
              className={`p-4 rounded-xl border ${
                e.score >= 85
                  ? "border-accent/50 bg-accent/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="text-sm font-medium truncate">{e.district}</div>
              <div className="text-2xl font-bold text-accent">{e.score.toFixed(0)}</div>
              <div className="text-xs text-gray-500">
                Potential: ₹{(e.potential / 100).toFixed(1)} Cr
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
