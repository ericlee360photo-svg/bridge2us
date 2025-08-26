import * as d3 from "d3-geo";

// Flat 2:1 equirectangular canvas (works with 1440x720 or any 2:1 viewBox)
export const worldWidth = 1440;
export const worldHeight = 720;

export const projection = d3.geoEquirectangular()
  .fitSize([worldWidth, worldHeight], { type: "Sphere" });

// Lat/Lon → [x,y]
export function project([lon, lat]: [number, number]): [number, number] {
  return projection([lon, lat]) as [number, number];
}

// Haversine (km)
export function haversineKm(a: [number, number], b: [number, number]): number {
  const [lon1, lat1] = a.map(d => d * Math.PI / 180) as [number, number];
  const [lon2, lat2] = b.map(d => d * Math.PI / 180) as [number, number];
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const R = 6371; // km
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const kmToMi = (km: number): number => km * 0.621371;

// Great-circle arc as SVG path (quadratic for look; not geodesic math-heavy)
export function arcPath(a: [number, number], b: [number, number], curve = 0.25): string {
  const [x1, y1] = a, [x2, y2] = b;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - curve * Math.hypot(x2 - x1, y2 - y1);
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}
