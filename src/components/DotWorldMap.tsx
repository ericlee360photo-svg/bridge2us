import React, { useMemo } from "react";
import { buildDots } from "../lib/dots";
import { arcPath, haversineKm, kmToMi, project, worldHeight, worldWidth } from "../lib/geo";

export type LatLon = { lat: number; lon: number };
type Props = {
  a?: LatLon;               // partner A location
  b?: LatLon;               // partner B location
  showOceanDots?: boolean;  // render ocean dots subtly under land
  spacing?: number;
  landColor?: string;
  oceanColor?: string;
  dotRadius?: number;
  linkColor?: string;
  label?: "km" | "mi" | "both";
  className?: string;
};

export default function DotWorldMap({
  a, b,
  showOceanDots = true,
  spacing = 12,
  landColor = "#cfd6ff",
  oceanColor = "rgba(42,47,58,.55)",
  dotRadius = 2.2,
  linkColor = "#ff6b6b",
  label = "both",
  className
}: Props) {

  const land = useMemo(() => buildDots({
    spacing, radius: dotRadius, width: worldWidth, height: worldHeight, landOnly: true
  }), [spacing, dotRadius]);

  const ocean = useMemo(() => showOceanDots ? buildDots({
    spacing, radius: dotRadius - 0.3, width: worldWidth, height: worldHeight, landOnly: false
  }) : null, [showOceanDots, spacing, dotRadius]);

  const pA = a ? project([a.lon, a.lat]) : undefined;
  const pB = b ? project([b.lon, b.lat]) : undefined;

  const distKm = (a && b) ? haversineKm([a.lon, a.lat], [b.lon, b.lat]) : undefined;
  const distMi = distKm !== undefined ? kmToMi(distKm) : undefined;

  const path = (pA && pB) ? arcPath(pA, pB, 0.25) : undefined;
  const mid = (pA && pB) ? [(pA[0] + pB[0]) / 2, (pA[1] + pB[1]) / 2 - 20] : undefined;

  return (
    <svg
      viewBox={`0 0 ${worldWidth} ${worldHeight}`}
      className={className}
      style={{
        background: "#0f1115",
        width: "100%",
        height: "auto",
        aspectRatio: "2 / 1",
        borderRadius: 16,
        position: "relative",
        zIndex: 1
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean dots */}
      {ocean && ocean.dots.map((d, i) => (
        <circle key={`o-${i}`} cx={d.x} cy={d.y} r={ocean.radius} fill={oceanColor} />
      ))}

      {/* Land dots */}
      {land.dots.map((d, i) => (
        <circle key={`l-${i}`} cx={d.x} cy={d.y} r={land.radius} fill={landColor} />
      ))}

      {/* Connection arc */}
      {path && <path d={path} stroke={linkColor} strokeWidth={5} fill="none"
                     style={{ filter: "drop-shadow(0 0 6px rgba(255,107,107,.6))" }} />}

      {/* User Markers with Labels */}
      {pA && <g transform={`translate(${pA[0]},${pA[1]})`}>
        {/* Glow effect */}
        <circle r={12} fill="rgba(255,209,102,0.3)" />
        <circle r={9} fill="#ffd166" stroke="#fff" strokeWidth="2" />
        <circle r={4} fill="#fff" />
        {/* Label */}
        <text y={-15} textAnchor="middle" 
              fontFamily="system-ui, -apple-system, Segoe UI, Roboto"
              fontSize={14} fill="#ffd166" fontWeight="600">
          You
        </text>
        {/* Coordinates */}
        <text y={5} textAnchor="middle" 
              fontFamily="system-ui, -apple-system, Segoe UI, Roboto"
              fontSize={12} fill="#eaeef9" opacity={0.8}>
          {a?.lat.toFixed(2)}, {a?.lon.toFixed(2)}
        </text>
      </g>}
      
      {pB && <g transform={`translate(${pB[0]},${pB[1]})`}>
        {/* Glow effect */}
        <circle r={12} fill="rgba(6,214,160,0.3)" />
        <circle r={9} fill="#06d6a0" stroke="#fff" strokeWidth="2" />
        <circle r={4} fill="#fff" />
        {/* Label */}
        <text y={-15} textAnchor="middle" 
              fontFamily="system-ui, -apple-system, Segoe UI, Roboto"
              fontSize={14} fill="#06d6a0" fontWeight="600">
          Partner
        </text>
        {/* Coordinates */}
        <text y={5} textAnchor="middle" 
              fontFamily="system-ui, -apple-system, Segoe UI, Roboto"
              fontSize={12} fill="#eaeef9" opacity={0.8}>
          {b?.lat.toFixed(2)}, {b?.lon.toFixed(2)}
        </text>
      </g>}

      {/* Distance label */}
      {mid && distKm !== undefined && (
        <text x={mid[0]} y={mid[1]} textAnchor="middle"
              fontFamily="system-ui, -apple-system, Segoe UI, Roboto"
              fontSize={22} fill="#eaeef9">
          {label === "km" && `${Math.round(distKm).toLocaleString()} km`}
          {label === "mi" && `${Math.round(distMi!).toLocaleString()} mi`}
          {label === "both" && `${Math.round(distKm).toLocaleString()} km · ${Math.round(distMi!).toLocaleString()} mi`}
        </text>
      )}
    </svg>
  );
}
