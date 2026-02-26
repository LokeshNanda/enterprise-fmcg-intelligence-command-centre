"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import type { DashboardData } from "@/lib/types";

const SLIDE_DURATION_MS = 6000;
const KPI_CONFIG = [
  { key: "revenue" as const, label: "Global Revenue", format: "currency" as const, getValue: (d: DashboardData) => d.revenue },
  { key: "salesGrowth" as const, label: "Sales Growth", format: "percent" as const, getValue: (d: DashboardData) => d.salesGrowth },
  { key: "distributionReach" as const, label: "Distribution Reach", format: "percent" as const, getValue: (d: DashboardData) => d.distributionReach },
  { key: "productionEfficiency" as const, label: "Production Efficiency", format: "percent" as const, getValue: (d: DashboardData) => d.productionEfficiency },
  { key: "workingCapitalDays" as const, label: "Working Capital Days", format: "days" as const, getValue: (d: DashboardData) => d.workingCapitalDays },
  { key: "enterpriseRiskIndex" as const, label: "Enterprise Risk Index", format: "number" as const, getValue: (d: DashboardData) => d.enterpriseRiskIndex },
];

interface ExecutiveBriefingModeProps {
  data: DashboardData;
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutiveBriefingMode({ data, isOpen, onClose }: ExecutiveBriefingModeProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = 3; // KPI overview, Manufacturing + Sales, AI Insights

  const nextSlide = useCallback(() => {
    setSlideIndex((i) => (i + 1) % totalSlides);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(nextSlide, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [isOpen, nextSlide]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0A0F1C] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Executive Briefing
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === slideIndex ? "bg-accent scale-125" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Exit Briefing (Esc)
          </button>
        </div>

        {/* Slides */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-auto min-h-0">
          <AnimatePresence mode="wait">
            {slideIndex === 0 && (
              <SlideKPIOverview key="kpi" data={data} />
            )}
            {slideIndex === 1 && (
              <SlideOperations key="ops" data={data} />
            )}
            {slideIndex === 2 && (
              <SlideAIInsights key="ai" insights={data.aiInsights} />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 border-t border-white/10 text-center text-xs text-gray-500">
          Enterprise FMCG Intelligence Command Centre · Auto-refresh every 20s
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SlideKPIOverview({ data }: { data: DashboardData }) {
  return (
    <motion.div
      key="kpi"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl"
    >
      <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wider">
        Enterprise KPI Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {KPI_CONFIG.map((config, i) => {
          const value = config.getValue(data);
          const isRisk = config.key === "enterpriseRiskIndex";
          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center justify-center min-h-[100px] p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 text-center min-w-0"
            >
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 mb-2 text-center line-clamp-2">
                {config.label}
              </div>
              <div
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums ${
                  isRisk && value > 4 ? "text-red-400" : "text-accent"
                }`}
              >
                <AnimatedCounter value={value} format={config.format} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SlideOperations({ data }: { data: DashboardData }) {
  const { manufacturing, sales } = data;
  return (
    <motion.div
      key="ops"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl"
    >
      <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wider">
        Operations Snapshot
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        <div className="flex flex-col p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 min-h-0">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 shrink-0">Manufacturing</h3>
          <div className="space-y-4 flex-1">
            {[
              { label: "OEE", value: manufacturing.oee, format: "percent" as const },
              { label: "Demand vs Production", value: manufacturing.demandVsProduction, format: "percent" as const },
              { label: "Downtime", value: manufacturing.downtime, format: "percent" as const },
              { label: "Energy Efficiency", value: manufacturing.energyEfficiency, format: "percent" as const },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-center gap-4">
                <span className="text-gray-400 truncate">{m.label}</span>
                <span className="text-xl font-bold text-accent shrink-0 tabular-nums">
                  <AnimatedCounter value={m.value} format={m.format} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 min-h-0">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 shrink-0">Sales & Distribution</h3>
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="min-w-0">
              <div className="text-xs text-gray-500 mb-1">Top Dealer</div>
              <div className="text-lg font-bold text-accent truncate">{sales.topDealers[0]?.name ?? "—"}</div>
              <div className="text-sm text-gray-400">₹{(sales.topDealers[0]?.sales ?? 0) / 1000} Cr</div>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 mb-1">Top SKU Momentum</div>
              <div className="text-lg font-bold text-accent truncate">{sales.skuMomentum[0]?.sku ?? "—"}</div>
              <div className="text-sm text-gray-400">
                <AnimatedCounter value={sales.skuMomentum[0]?.growth ?? 0} format="percent" /> growth
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 mt-auto border-t border-white/10 gap-4">
              <span className="text-gray-400">Promotion ROI</span>
              <span className="text-xl font-bold text-accent shrink-0 tabular-nums">
                <AnimatedCounter value={sales.promotionROI} format="number" />x
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SlideAIInsights({ insights }: { insights: string[] }) {
  return (
    <motion.div
      key="ai"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-2 text-center uppercase tracking-wider">
        AI Executive Insights
      </h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Data-driven recommendations for leadership
      </p>
      <ul className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-2">
        {insights.map((insight, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 min-w-0"
          >
            <span className="text-accent text-xl font-bold shrink-0">{i + 1}.</span>
            <span className="text-base md:text-lg text-gray-200 break-words">{insight}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
