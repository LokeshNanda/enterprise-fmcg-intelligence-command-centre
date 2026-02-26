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
  Legend,
} from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { MarketingImpactData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export default function MarketingImpactPage() {
  const [data, setData] = useState<MarketingImpactData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/marketing-impact");
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

  const exposureByCampaign = data.campaignExposure.reduce(
    (acc: Record<string, number>, x) => {
      acc[x.campaign] = (acc[x.campaign] || 0) + x.reach;
      return acc;
    },
    {}
  );
  const campaignReachData = Object.entries(exposureByCampaign).map(([k, v]) => ({
    campaign: k,
    reach: v,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Campaign Exposure Map
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignReachData}>
              <XAxis dataKey="campaign" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                formatter={(v: number) => [`${(v / 1000).toFixed(0)}K reach`, ""]}
              />
              <Bar dataKey="reach" fill="#00D4FF" radius={[4, 4, 0, 0]} />
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
          Sales Uplift Correlation Graph
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.salesUplift}>
              <XAxis dataKey="campaign" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                formatter={(v: number) => [`${v.toFixed(1)}% uplift`, ""]}
              />
              <Bar dataKey="uplift" fill="#22C55E" radius={[4, 4, 0, 0]} />
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
          Media Mix Performance Chart
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.mediaMix}>
              <XAxis dataKey="channel" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="spend" fill="#00D4FF" name="Spend (Cr)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roi" fill="#8B5CF6" name="ROI" radius={[4, 4, 0, 0]} />
            </BarChart>
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
          Influencer ROI Tracker
        </h3>
        <div className="space-y-2">
          {data.influencerROI.map((i) => (
            <div
              key={i.name}
              className="flex justify-between items-center p-2 rounded-lg bg-white/5"
            >
              <span className="text-sm">{i.name}</span>
              <div className="flex gap-4">
                <span className="text-accent font-bold">
                  <AnimatedCounter value={i.roi} format="number" />x
                </span>
                <span className="text-gray-400 text-xs">{(i.reach / 1000).toFixed(0)}K reach</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Channel Performance Comparison (Digital vs Offline)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.channelPerformance}>
              <XAxis dataKey="channel" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 15, 28, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="digital" fill="#00D4FF" name="Digital %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offline" fill="#6B7280" name="Offline %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
