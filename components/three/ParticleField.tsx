"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scroll, useStore } from "@/lib/store";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uScroll;
  attribute float aRand;
  attribute float aSize;
  varying float vAlpha;
  varying float vGold;

  void main() {
    vec3 p = position;
    float t = uTime * 0.18;
    p.x += sin(t + aRand * 6.2831 + p.y * 0.45) * 0.35;
    p.y += cos(t * 0.9 + aRand * 6.2831 + p.x * 0.35) * 0.35 + uScroll * (2.0 + aRand * 3.0);
    p.z += sin(t * 0.7 + aRand * 12.0) * 0.3;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 diff = ndc - uMouse;
    diff.x *= uAspect;
    float d = length(diff);
    float force = smoothstep(0.32, 0.0, d);
    clip.xy += normalize(diff + 1e-5) * force * 0.14 * clip.w;

    gl_Position = clip;
    gl_PointSize = aSize * uPixelRatio * (26.0 / -mv.z) * (1.0 + force * 1.8);
    vAlpha = (0.18 + aRand * 0.7) * (1.0 - clamp(uScroll, 0.0, 1.0) * 0.85);
    vGold = step(0.92, aRand) + force * 0.9;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vGold;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    vec3 col = mix(uInk, uAccent, clamp(vGold, 0.0, 1.0));
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

function Points({ count, heroRef }: { count: number; heroRef: React.RefObject<HTMLElement> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const theme = useStore((s) => s.theme);
  const mouse = useRef({ x: 10, y: 10, tx: 10, ty: 10 });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      rand[i] = Math.random();
      sizes[i] = 0.6 + Math.random() * 1.8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uAspect: { value: 1 },
      uPixelRatio: { value: 1 },
      uScroll: { value: 0 },
      uInk: { value: new THREE.Color("#F2F0EA") },
      uAccent: { value: new THREE.Color("#EBB94A") },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uInk.value.set(theme === "dark" ? "#F2F0EA" : "#0A0A0A");
    uniforms.uAccent.value.set(theme === "dark" ? "#EBB94A" : "#8A5A00");
  }, [theme, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.08;
    m.y += (m.ty - m.y) * 0.08;
    u.uMouse.value.set(m.x, m.y);
    u.uAspect.value = size.width / size.height;
    u.uPixelRatio.value = viewport.dpr;
    const h = heroRef.current?.offsetHeight || window.innerHeight;
    u.uScroll.value = Math.min(1.2, (scroll.y || window.scrollY) / h);
    state.camera.position.x += (m.x * 0.6 - state.camera.position.x) * 0.03;
    state.camera.position.y += (m.y * 0.4 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticleField({ active, heroRef }: { active: boolean; heroRef: React.RefObject<HTMLElement> }) {
  const count = typeof window !== "undefined" && window.innerWidth < 768 ? 650 : 1600;
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      eventSource={undefined}
      style={{ pointerEvents: "none" }}
    >
      <Points count={count} heroRef={heroRef} />
    </Canvas>
  );
}
