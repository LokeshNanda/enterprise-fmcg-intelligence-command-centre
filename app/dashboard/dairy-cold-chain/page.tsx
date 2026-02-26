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
  Cell,
} from "recharts";
import type { DairyColdChainData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

const STATUS_COLORS = {
  safe: "#22C55E",
  risk: "#F59E0B",
  spoilage: "#EF4444",
};

export default function DairyColdChainPage() {
  const [data, setData] = useState<DairyColdChainData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/dairy-cold-chain");
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
          Cold Chain Route Animation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.routes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-xl border ${
                route.status === "safe"
                  ? "border-green-500/50 bg-green-500/10"
                  : route.status === "risk"
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-red-500/50 bg-red-500/10"
              }`}
            >
              <div className="text-sm font-medium">
                {route.from} → {route.to}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Temp: {route.temp}°C · Lag: {route.lag}h
              </div>
              <div
                className={`text-[10px] uppercase mt-1 font-medium ${
                  route.status === "safe"
                    ? "text-green-400"
                    : route.status === "risk"
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                {route.status}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Safe
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Risk
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Spoilage Alert
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Temperature Risk Zone Map
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.routes}>
              <XAxis dataKey="id" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="temp" radius={[4, 4, 0, 0]}>
                {data.routes.map((r, i) => (
                  <Cell key={i} fill={STATUS_COLORS[r.status]} />
                ))}
              </Bar>
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
          Spoilage Rates by Region
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.spoilageRates}>
              <XAxis dataKey="region" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="rate" fill="#EF4444" radius={[4, 4, 0, 0]} />
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
          Distribution Lag
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.distributionLag.map((d) => (
            <div
              key={d.route}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <span className="text-sm">{d.route}</span>
              <span className="ml-2 font-bold text-accent">{d.hours.toFixed(1)}h</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
