"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export const NAV_ITEMS = [
  { href: "/dashboard/command-centre", label: "Command Centre", icon: "⌘" },
  { href: "/dashboard/fmcg-sales", label: "FMCG Sales", icon: "📈" },
  { href: "/dashboard/dairy-cold-chain", label: "Dairy Cold Chain", icon: "🥛" },
  { href: "/dashboard/retail-footwear", label: "Retail Footwear", icon: "👟" },
  { href: "/dashboard/supply-chain", label: "Supply Chain", icon: "🔗" },
  { href: "/dashboard/marketing-impact", label: "Marketing Impact", icon: "📣" },
  { href: "/dashboard/forecast", label: "Demand Forecast", icon: "📊" },
  { href: "/dashboard/rural-growth", label: "Rural Growth", icon: "🌾" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 h-fit">
      <div className="text-[10px] uppercase tracking-widest text-gray-500 px-3 py-2 mb-2">
        Dashboards
      </div>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DashboardSidebarMobile() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto py-2 px-2 -mx-2 scrollbar-hide">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="shrink-0">
            <motion.div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "text-gray-400 hover:text-gray-200 bg-white/5 border border-transparent"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
