"use client";

import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import type { StateData } from "@/lib/types";

const GEOJSON_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

const STATE_NAME_ALIASES: Record<string, string> = {
  "Jammu & Kashmir": "Jammu and Kashmir",
  "Andaman & Nicobar": "Andaman and Nicobar Islands",
};

interface IndiaHeatMapProps {
  states: StateData[];
  mode: "revenue" | "risk";
  onStateHover?: (state: StateData | null) => void;
  onStateClick?: (state: StateData | null) => void;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

function getColor(value: number, mode: "revenue" | "risk"): string {
  if (mode === "revenue") {
    const r = Math.round(0 + (0 - 0) * (1 - value));
    const g = Math.round(100 + (212 - 100) * value);
    const b = Math.round(150 + (255 - 150) * value);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const r = Math.round(239 + (255 - 239) * value);
    const g = Math.round(68 + (150 - 68) * (1 - value));
    const b = Math.round(68 + (100 - 68) * (1 - value));
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function resolveStateName(geoName: string): string {
  return STATE_NAME_ALIASES[geoName] ?? geoName;
}

export function IndiaHeatMap({ states, mode, onStateHover, onStateClick }: IndiaHeatMapProps) {
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);

  const { stateMap, minVal, maxVal } = useMemo(() => {
    const map = new Map(states.map((s) => [s.name, s]));
    const values = states.map((s) =>
      mode === "revenue" ? s.revenue : s.risk
    );
    return {
      stateMap: map,
      minVal: Math.min(...values),
      maxVal: Math.max(...values),
    };
  }, [states, mode]);

  const handleMouseEnter = (geo: { properties?: { ST_NM?: string } }) => {
    const geoName = geo.properties?.ST_NM;
    if (!geoName) return;
    const resolvedName = resolveStateName(geoName);
    const state = stateMap.get(resolvedName);
    setHoveredState(state ?? null);
    onStateHover?.(state ?? null);
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    onStateHover?.(null);
  };

  const handleClick = (geo: { properties?: { ST_NM?: string } }) => {
    const geoName = geo.properties?.ST_NM;
    if (!geoName) return;
    const resolvedName = resolveStateName(geoName);
    const state = stateMap.get(resolvedName);
    onStateClick?.(state ?? null);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/5 border border-white/10 flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [78.5, 22],
          scale: 800,
        }}
        width={800}
        height={600}
        className="india-map-svg"
        style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
      >
        <ZoomableGroup center={[78.5, 22]} zoom={1} minZoom={0.5} maxZoom={8}>
        <Geographies geography={GEOJSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName = geo.properties?.ST_NM as string | undefined;
              const resolvedName = geoName
                ? resolveStateName(geoName)
                : undefined;
              const state = resolvedName ? stateMap.get(resolvedName) : null;
              const val = state
                ? mode === "revenue"
                  ? state.revenue
                  : state.risk
                : null;
              const n =
                val !== null ? normalize(val, minVal, maxVal) : 0.5;
              const fillColor =
                val !== null ? getColor(n, mode) : "rgba(100,100,100,0.3)";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="rgba(0,212,255,0.4)"
                  strokeWidth={1}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={() => handleMouseEnter(geo)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(geo)}
                />
              );
            })
          }
        </Geographies>
        {/* State labels */}
        <Geographies geography={GEOJSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName = geo.properties?.ST_NM as string | undefined;
              if (!geoName) return null;
              try {
                const centroid = geoCentroid(geo as unknown as Parameters<typeof geoCentroid>[0]);
                const resolvedName = resolveStateName(geoName);
                const state = stateMap.get(resolvedName);
                const displayName = state ? resolvedName : geoName;
                return (
                  <Marker key={`label-${geo.rsmKey}`} coordinates={centroid}>
                    <text
                      textAnchor="middle"
                      fontSize={9}
                      fill="rgba(255,255,255,0.85)"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {displayName.length > 12 ? displayName.slice(0, 10) + "…" : displayName}
                    </text>
                  </Marker>
                );
              } catch {
                return null;
              }
            })
          }
        </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <span
          className={`px-3 py-1 rounded-lg text-xs font-medium ${
            mode === "revenue"
              ? "bg-accent/20 text-accent"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {mode === "revenue" ? "Revenue" : "Risk"}
        </span>
        <span className="text-[10px] text-gray-500">Scroll to zoom · Drag to pan · Click state for details</span>
      </div>
      <AnimatePresence>
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/60 backdrop-blur border border-white/10"
          >
            <div className="text-sm font-medium text-white">
              {hoveredState.name}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Revenue: ₹{(hoveredState.revenue / 1000).toFixed(1)} Cr · Growth:{" "}
              {hoveredState.growth.toFixed(1)}% · Risk:{" "}
              {hoveredState.risk.toFixed(1)}
            </div>
            <div className="text-[10px] text-accent/80 mt-1">Click to open full details</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
