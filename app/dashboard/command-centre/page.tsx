"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndiaHeatMap } from "@/components/IndiaHeatMap";
import { ManufacturingPanel } from "@/components/ManufacturingPanel";
import { SalesPanel } from "@/components/SalesPanel";
import { FinancePanel } from "@/components/FinancePanel";
import { AIInsights } from "@/components/AIInsights";
import type { DashboardData, StateData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export default function CommandCentrePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [mapMode, setMapMode] = useState<"revenue" | "risk">("revenue");
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  useEffect(() => {
    if (selectedState) setDrawerOpen(true);
  }, [selectedState]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent text-lg"
        >
          Loading command centre...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Panel - Manufacturing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 order-2 lg:order-1"
        >
          <ManufacturingPanel data={data.manufacturing} />
        </motion.div>

        {/* Center - India Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-8 order-1 lg:order-2 relative"
        >
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="flex gap-2 p-3 border-b border-white/10">
              <button
                onClick={() => setMapMode("revenue")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mapMode === "revenue"
                    ? "bg-accent/20 text-accent shadow-glow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setMapMode("risk")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mapMode === "risk"
                    ? "bg-red-500/20 text-red-400 shadow-glow-critical"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Risk
              </button>
            </div>
            <div className="p-4 h-[400px] lg:h-[450px]">
              <IndiaHeatMap
                states={data.states}
                mode={mapMode}
                onStateHover={setSelectedState}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Sales */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 order-3"
        >
          <SalesPanel data={data.sales} />
        </motion.div>

        {/* Bottom Left - Finance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-4 order-4"
        >
          <FinancePanel data={data.finance} />
        </motion.div>

        {/* Bottom Right - AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-8 order-5"
        >
          <AIInsights insights={data.aiInsights} />
        </motion.div>
      </div>

      {/* Drill-down Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedState && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0F1C]/95 backdrop-blur-xl border-l border-white/10 z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">
                  {selectedState.name}
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-500">Revenue</span>
                  <div className="text-2xl font-bold text-accent">
                    ₹{(selectedState.revenue / 1000).toFixed(2)} Cr
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-500">Growth YoY</span>
                  <div className="text-2xl font-bold text-accent">
                    {selectedState.growth.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-500">Risk Index</span>
                  <div
                    className={`text-2xl font-bold ${
                      selectedState.risk > 4 ? "text-red-400" : "text-amber-400"
                    }`}
                  >
                    {selectedState.risk.toFixed(1)}/10
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
