import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import worldTopo from "../data/world-110m.topo.json";

// Build a dot grid and keep dots that fall on land (or ocean if invert=true)
export function buildDots(opts: {
  spacing?: number; // px between dots
  radius?: number;  // dot radius
  width: number;
  height: number;
  landOnly?: boolean; // default true
}) {
  const { spacing = 12, radius = 2.2, width, height, landOnly = true } = opts;

  // Extract GeoJSON land MultiPolygon from TopoJSON
  // @ts-expect-error – depends on your topo file's object names
  const landGeo = feature(worldTopo as unknown, (worldTopo as unknown).objects.land) as unknown;

  const dots: { x: number; y: number }[] = [];
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      // Map pixel back to lon/lat to test geoContains
      const lon = (x / width) * 360 - 180;
      const lat = 90 - (y / height) * 180;
      const isLand = geoContains(landGeo, [lon, lat]);
      
      // Filter out Antarctica from land dots, but include it in ocean dots
      const isAntarctica = lat < -60;
      
      if (landOnly) {
        // For land dots: include all land except Antarctica
        if (isLand && !isAntarctica) {
          dots.push({ x, y });
        }
      } else {
        // For ocean dots: include all ocean areas AND Antarctica
        if (!isLand || isAntarctica) {
          dots.push({ x, y });
        }
      }
    }
  }
  return { dots, radius };
}
