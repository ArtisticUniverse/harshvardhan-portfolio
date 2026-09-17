"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { curveLayout, pdf } from "./curve";

const vertex = /* glsl */ `
  uniform float uP;
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec3 aCurve;
  attribute vec3 aScatter;
  attribute float aRand;
  varying float vAlpha;
  varying float vGold;

  float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }

  void main() {
    float appear = smoothstep(0.26, 0.34, uP);
    float crack = ease(clamp((uP - 0.34 - aRand * 0.06) / 0.2, 0.0, 1.0));
    float form = ease(clamp((uP - 0.52 - aRand * 0.1) / 0.28, 0.0, 1.0));

    vec3 p = mix(position, aScatter, crack);
    p = mix(p, aCurve, form);

    // Breathing jitter while scattered.
    float loose = crack * (1.0 - form);
    p.x += sin(uTime * 1.3 + aRand * 40.0) * 6.0 * loose;
    p.y += cos(uTime * 1.1 + aRand * 30.0) * 6.0 * loose;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + aRand * 2.2 + loose * 1.5) * uPixelRatio;
    vAlpha = appear * (0.55 + aRand * 0.45);
    vGold = form * smoothstep(0.62, 0.8, aCurve.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vGold;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(mix(uInk, uAccent, vGold), a * vAlpha);
  }
`;

function gaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Sample filled pixels of the rendered number so particles start where the digits are. */
function sampleText(text: string, font: string, fontPx: number, w: number, h: number, count: number) {
  const scale = 0.5;
  const cw = Math.max(1, Math.floor(w * scale));
  const ch = Math.max(1, Math.floor(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const pts: [number, number][] = [];
  if (!ctx) return pts;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${fontPx * scale}px ${font}`;
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.05 * fontPx * scale}px`;
  ctx.fillText(text, cw / 2, ch / 2);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const filled: number[] = [];
  for (let y = 0; y < ch; y += 1) {
    for (let x = 0; x < cw; x += 1) {
      if (data[(y * cw + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  const n = filled.length / 2;
  for (let i = 0; i < count && n > 0; i++) {
    const k = Math.floor(Math.random() * n) * 2;
    pts.push([filled[k] / scale - w / 2 + Math.random() * 2, -(filled[k + 1] / scale - h / 2) + Math.random() * 2]);
  }
  return pts;
}

function Cloud({ progress, font, fontPx }: { progress: React.MutableRefObject<number>; font: string; fontPx: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const theme = useStore((s) => s.theme);
  const count = size.width < 768 ? 2600 : 5200;

  const geometry = useMemo(() => {
    const { width: w, height: h } = size;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const curve = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const text = typeof document !== "undefined" ? sampleText("99.92", font, fontPx, w, h, count) : [];
    const L = curveLayout(w, h);

    for (let i = 0; i < count; i++) {
      const t = text[i] ?? [(Math.random() - 0.5) * w * 0.6, (Math.random() - 0.5) * h * 0.3];
      pos.set([t[0], t[1], 0], i * 3);

      scatter.set([(Math.random() - 0.5) * w * 1.1, (Math.random() - 0.5) * h * 1.1, 0], i * 3);

      let z: number;
      let y: number;
      if (Math.random() < 0.32) {
        // Outline of the curve.
        z = -4 + Math.random() * 8;
        y = pdf(z) / pdf(0) + (Math.random() - 0.5) * 0.012;
      } else {
        // Area under the curve, uniform by area.
        do {
          z = gaussian();
        } while (Math.abs(z) > 4);
        y = Math.random() * (pdf(z) / pdf(0));
      }
      const x = L.cx + (z / 4) * L.halfWidth;
      const yy = L.baseline + y * L.peak;
      // z channel carries the normalised x so the tail can glow gold.
      curve.set([x, yy, (z + 4) / 8], i * 3);
      rand[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aCurve", new THREE.BufferAttribute(curve, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [size, count, font, fontPx]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uP: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uInk: { value: new THREE.Color("#F2F0EA") },
      uAccent: { value: new THREE.Color("#EBB94A") },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uInk.value.set(theme === "dark" ? "#F2F0EA" : "#0A0A0A");
    uniforms.uAccent.value.set(theme === "dark" ? "#EBB94A" : "#8A5A00");
  }, [theme, uniforms]);

  useFrame((_, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uP.value += (progress.current - u.uP.value) * 0.2;
    u.uPixelRatio.value = viewport.dpr;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

export default function NumberParticles({
  progress,
  active,
  font,
  fontPx,
}: {
  progress: React.MutableRefObject<number>;
  active: boolean;
  font: string;
  fontPx: number;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      orthographic
      camera={{ position: [0, 0, 100], zoom: 1 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <Cloud progress={progress} font={font} fontPx={fontPx} />
    </Canvas>
  );
}
