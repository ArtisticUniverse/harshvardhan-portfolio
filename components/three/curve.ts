/** Shared bell-curve geometry so WebGL particles and DOM labels line up. */

export const pdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

/** Pixel layout of the curve in a centred coordinate space (y up). */
export function curveLayout(w: number, h: number) {
  const mobile = w < 768;
  return {
    cx: 0,
    halfWidth: w * (mobile ? 0.46 : 0.4),
    baseline: -h * (mobile ? 0.12 : 0.2),
    peak: h * (mobile ? 0.36 : 0.44),
  };
}

/** z-score of the 99.92nd percentile. */
export const Z_9992 = 3.156;

/** Convert a curve point to CSS top/left (px) within a w×h box. */
export function curveToCss(z: number, w: number, h: number) {
  const L = curveLayout(w, h);
  const x = L.cx + (z / 4) * L.halfWidth;
  const y = L.baseline + (pdf(z) / pdf(0)) * L.peak;
  return { left: w / 2 + x, top: h / 2 - y, baselineTop: h / 2 - L.baseline };
}
