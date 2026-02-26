"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { KPIBar } from "@/components/KPIBar";
import { BackgroundGrid } from "@/components/BackgroundGrid";
import { DashboardSidebar, DashboardSidebarMobile } from "@/components/DashboardSidebar";
import type { DashboardData } from "@/lib/types";

const REFRESH_INTERVAL_MS = 20000;

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [kpiData, setKpiData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      const json = await res.json();
      setKpiData(json);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  return (
    <div className="min-h-screen overflow-hidden">
      <BackgroundGrid />
      <div className="flex gap-4 p-4 lg:p-6 max-w-[1920px] mx-auto">
        <aside className="hidden lg:block">
          <DashboardSidebar />
        </aside>
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="lg:hidden mb-2">
            <DashboardSidebarMobile />
          </div>
          {kpiData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <KPIBar data={kpiData} />
            </motion.div>
          )}
          <div className="flex-1 min-h-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
