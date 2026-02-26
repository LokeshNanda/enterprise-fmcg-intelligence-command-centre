"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { KPIBar } from "@/components/KPIBar";
import { BackgroundGrid } from "@/components/BackgroundGrid";
import { DashboardSidebar, DashboardSidebarMobile } from "@/components/DashboardSidebar";
import { ExecutiveBriefingMode } from "@/components/ExecutiveBriefingMode";
import { AskYourData } from "@/components/AskYourData";
import { getUserOpenAIKey } from "@/lib/openaiKey";
import type { DashboardData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [kpiData, setKpiData] = useState<DashboardData | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [userKeyVersion, setUserKeyVersion] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const userKey = getUserOpenAIKey();
      const headers: Record<string, string> = {};
      if (userKey) headers["X-OpenAI-Key"] = userKey;
      const res = await fetch("/api/metrics", { headers });
      const json = await res.json();
      setKpiData(json);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }, []);

  useEffect(() => {
    const onKeyChanged = () => setUserKeyVersion((v) => v + 1);
    window.addEventListener("openai-key-changed", onKeyChanged);
    return () => window.removeEventListener("openai-key-changed", onKeyChanged);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData, userKeyVersion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBriefingOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto lg:overflow-hidden">
      <BackgroundGrid />
      <div className="flex gap-4 p-3 sm:p-4 lg:p-6 max-w-[1920px] mx-auto">
        <aside className="hidden lg:block">
          <DashboardSidebar />
        </aside>
        <main className="flex-1 min-w-0 flex flex-col min-h-0 lg:min-h-screen">
          <div className="lg:hidden mb-2 shrink-0">
            <DashboardSidebarMobile />
          </div>
          {kpiData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-col lg:flex-row lg:items-center gap-3 shrink-0"
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                <KPIBar data={kpiData} />
              </div>
              <button
                onClick={() => setBriefingOpen(true)}
                className="shrink-0 w-full lg:w-auto px-4 py-3 lg:py-2 rounded-xl text-sm font-medium bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-colors touch-manipulation"
              >
                Executive Briefing
              </button>
            </motion.div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible pb-20 lg:pb-0">{children}</div>
        </main>
      </div>
      {kpiData && (
        <ExecutiveBriefingMode
          data={kpiData}
          isOpen={briefingOpen}
          onClose={() => setBriefingOpen(false)}
        />
      )}
      <AskYourData data={kpiData} />
    </div>
  );
}
