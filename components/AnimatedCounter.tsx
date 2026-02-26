"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  format?: "number" | "currency" | "percent" | "days";
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  format = "number",
  duration = 0.6,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    prevValueRef.current = value;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (value - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  const formatted =
    format === "currency"
      ? `₹${(displayValue / 1000).toFixed(1)}B`
      : format === "percent"
        ? `${displayValue.toFixed(1)}%`
        : format === "days"
          ? `${Math.round(displayValue)}d`
          : displayValue.toLocaleString("en-IN", { maximumFractionDigits: 1 });

  return (
    <motion.span
      className={className}
      initial={false}
      key={formatted}
      transition={{ duration: 0.2 }}
    >
      {formatted}
    </motion.span>
  );
}
