"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StateData } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const GEOJSON_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

interface IndiaHeatMapProps {
  states: StateData[];
  mode: "revenue" | "risk";
  onStateHover?: (state: StateData | null) => void;
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

export function IndiaHeatMap({ states, mode, onStateHover }: IndiaHeatMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const stateMap = new Map(states.map((s) => [s.name, s]));
  const values = states.map((s) => (mode === "revenue" ? s.revenue : s.risk));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current) return;

    const loadMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.5, 22],
        zoom: 3.2,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.on("load", async () => {
        const res = await fetch(GEOJSON_URL);
        const geojson = await res.json();

        geojson.features.forEach((f: GeoJSON.Feature) => {
          const name = f.properties?.ST_NM;
          const state = stateMap.get(name);
          if (state) {
            const val = mode === "revenue" ? state.revenue : state.risk;
            const n = normalize(val, minVal, maxVal);
            (f.properties as Record<string, unknown>).value = val;
            (f.properties as Record<string, unknown>).fillColor = getColor(
              n,
              mode
            );
          }
        });

        map.addSource("india-states", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "state-fills",
          type: "fill",
          source: "india-states",
          paint: {
            "fill-color": [
              "match",
              ["get", "ST_NM"],
              ...geojson.features.flatMap((f: GeoJSON.Feature) => {
                const fill = (f.properties as Record<string, string>)?.fillColor;
                return fill ? [f.properties?.ST_NM, fill] : [];
              }),
              "rgba(100,100,100,0.3)",
            ],
            "fill-opacity": 0.8,
          },
        });

        map.addLayer({
          id: "state-borders",
          type: "line",
          source: "india-states",
          paint: {
            "line-color": "rgba(0,212,255,0.4)",
            "line-width": 1,
          },
        });

        map.on("mouseenter", "state-fills", (e) => {
          map.getCanvas().style.cursor = "pointer";
          const name = e.features?.[0]?.properties?.ST_NM;
          const state = name ? stateMap.get(name) : null;
          setSelectedState(state ?? null);
          onStateHover?.(state ?? null);
        });

        map.on("mouseleave", "state-fills", () => {
          map.getCanvas().style.cursor = "";
          setSelectedState(null);
          onStateHover?.(null);
        });
      });

      mapRef.current = map;
    };

    loadMap();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MAPBOX_TOKEN, mode]);

  if (!MAPBOX_TOKEN) {
    return (
      <IndiaHeatMapFallback
        states={states}
        mode={mode}
        onStateHover={onStateHover}
      />
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
      <div className="absolute top-3 left-3 flex gap-2">
        <span
          className={`px-3 py-1 rounded-lg text-xs font-medium ${
            mode === "revenue"
              ? "bg-accent/20 text-accent"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {mode === "revenue" ? "Revenue" : "Risk"}
        </span>
      </div>
      <AnimatePresence>
        {selectedState && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/60 backdrop-blur border border-white/10"
          >
            <div className="text-sm font-medium text-white">
              {selectedState.name}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Revenue: ₹{(selectedState.revenue / 1000).toFixed(1)} Cr · Growth:{" "}
              {selectedState.growth.toFixed(1)}% · Risk: {selectedState.risk.toFixed(1)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IndiaHeatMapFallback({
  states,
  mode,
  onStateHover,
}: IndiaHeatMapProps) {
  const values = states.map((s) => (mode === "revenue" ? s.revenue : s.risk));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-4">
      <div className="text-xs text-gray-500 mb-3">
        Set NEXT_PUBLIC_MAPBOX_TOKEN for interactive map. Showing state grid.
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto">
        {states.map((state) => {
          const val = mode === "revenue" ? state.revenue : state.risk;
          const n = normalize(val, minVal, maxVal);
          const color = getColor(n, mode);
          return (
            <motion.div
              key={state.name}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => onStateHover?.(state)}
              onMouseLeave={() => onStateHover?.(null)}
              className="p-2 rounded-lg cursor-pointer border border-white/10 hover:border-accent/50 transition-colors"
              style={{ backgroundColor: `${color}20` }}
            >
              <div className="text-xs font-medium truncate" title={state.name}>
                {state.name.split(" ")[0]}
              </div>
              <div className="text-[10px] text-gray-400">
                {mode === "revenue"
                  ? `₹${(state.revenue / 1000).toFixed(1)}Cr`
                  : state.risk.toFixed(1)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
