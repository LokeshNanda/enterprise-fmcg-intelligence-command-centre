"use client";

import { motion } from "framer-motion";

interface AIInsightsProps {
  insights: string[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:border-accent/20 transition-colors h-full flex flex-col"
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        AI Executive Insights
      </h3>
      <ul className="space-y-2 flex-1 min-h-0">
        {insights.map((insight, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-sm text-gray-300 flex gap-2"
          >
            <span className="text-accent shrink-0">•</span>
            <span>{insight}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
