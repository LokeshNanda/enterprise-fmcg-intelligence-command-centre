"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { geoMercator } from "d3-geo";

const GEOJSON_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [72.8777, 19.076],
  Pune: [73.8567, 18.5204],
  Delhi: [77.1025, 28.7041],
  Noida: [77.391, 28.5355],
  Bangalore: [77.5946, 12.9716],
  Mysore: [76.6394, 12.2958],
  Chennai: [80.2707, 13.0827],
  Coimbatore: [76.9558, 11.0168],
  Kolkata: [88.3639, 22.5726],
  Howrah: [88.2636, 22.5958],
  Hyderabad: [78.4867, 17.385],
  Secunderabad: [78.4983, 17.4399],
  Ahmedabad: [72.5714, 23.0225],
  Vadodara: [73.1812, 22.3072],
  Lucknow: [80.9462, 26.8467],
  Kanpur: [80.3319, 26.4499],
};

const STATUS_COLORS = {
  safe: "#22C55E",
  risk: "#F59E0B",
  spoilage: "#EF4444",
} as const;

interface Route {
  id: string;
  from: string;
  to: string;
  temp: number;
  status: "safe" | "risk" | "spoilage";
  lag: number;
}

interface ColdChainMapProps {
  routes: Route[];
}

const project = (() => {
  const proj = geoMercator()
    .center([78.5, 22])
    .scale(750)
    .translate([400, 300]);
  return (coord: [number, number]) => {
    const [lng, lat] = coord;
    const result = proj([lng, lat]);
    return (result ?? [0, 0]) as [number, number];
  };
})();

function AnimatedRouteDot({
  fromCoord,
  toCoord,
  color,
  duration,
}: {
  fromCoord: [number, number];
  toCoord: [number, number];
  color: string;
  duration: number;
}) {
  const progress = useMotionValue(0);

  const x = useTransform(
    progress,
    [0, 1],
    [fromCoord[0], toCoord[0]]
  );
  const y = useTransform(
    progress,
    [0, 1],
    [fromCoord[1], toCoord[1]]
  );

  useEffect(() => {
    const controls = animate(progress, [0, 1, 0], {
      duration: duration * 2,
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => controls.stop();
  }, [progress, duration]);

  return (
    <motion.circle
      r={6}
      fill={color}
      stroke="#0A0F1C"
      strokeWidth={2}
      cx={x}
      cy={y}
    />
  );
}

export function ColdChainMap({ routes }: ColdChainMapProps) {
  const routePaths = useMemo(() => {
    return routes
      .map((r) => {
        const from = CITY_COORDS[r.from];
        const to = CITY_COORDS[r.to];
        if (!from || !to) return null;
        const fromCoord = project(from);
        const toCoord = project(to);
        const path = `M ${fromCoord[0]} ${fromCoord[1]} L ${toCoord[0]} ${toCoord[1]}`;
        return {
          ...r,
          path,
          fromCoord: fromCoord as [number, number],
          toCoord: toCoord as [number, number],
        };
      })
      .filter(Boolean) as Array<Route & { path: string; fromCoord: [number, number]; toCoord: [number, number] }>;
  }, [routes]);

  const cityCoords = useMemo(() => {
    const seen = new Set<string>();
    return routePaths.flatMap((r) => {
      const fromKey = `${r.fromCoord[0]},${r.fromCoord[1]}`;
      const toKey = `${r.toCoord[0]},${r.toCoord[1]}`;
      const result: [number, number][] = [];
      if (!seen.has(fromKey)) {
        seen.add(fromKey);
        result.push(r.fromCoord);
      }
      if (!seen.has(toKey)) {
        seen.add(toKey);
        result.push(r.toCoord);
      }
      return result;
    });
  }, [routePaths]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black/5 border border-white/10 aspect-[4/3] min-h-[500px]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [78.5, 22],
          scale: 750,
        }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[78.5, 22]} zoom={1} minZoom={0.6} maxZoom={6}>
        <Geographies geography={GEOJSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(30,40,60,0.6)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={0.5}
                style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
              />
            ))
          }
        </Geographies>

        {/* Route lines */}
        <g>
          {routePaths.map((r) => (
            <g key={r.id}>
              <motion.path
                d={r.path}
                fill="none"
                stroke={STATUS_COLORS[r.status]}
                strokeWidth={2}
                strokeOpacity={0.8}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.5 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.8 }}
              />
              <AnimatedRouteDot
                fromCoord={r.fromCoord}
                toCoord={r.toCoord}
                color={STATUS_COLORS[r.status]}
                duration={3 + r.lag}
              />
            </g>
          ))}
        </g>

        {/* City markers */}
        {cityCoords.map((coord, i) => (
          <circle
            key={`${coord[0]}-${coord[1]}-${i}`}
            cx={coord[0]}
            cy={coord[1]}
            r={4}
            fill="#00D4FF"
            opacity={0.9}
          />
        ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-4 text-xs text-gray-300">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          Safe
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          Risk
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Spoilage
        </span>
      </div>
    </div>
  );
}
