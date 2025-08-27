export function svgToViewport(svg: SVGSVGElement, pt: { x: number; y: number }) {
  const r = svg.getBoundingClientRect();
  const scaleX = r.width / 1440; // our viewBox W
  const scaleY = r.height / 720; // our viewBox H
  return { left: r.left + pt.x * scaleX, top: r.top + pt.y * scaleY };
}
