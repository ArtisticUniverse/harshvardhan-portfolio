"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

export type CharacterState = { x: number; y: number; hover: number; px: number; py: number };

const vertex = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDepthScale;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    vDepth = d;
    vec3 p = position;
    p.z += d * uDepthScale;
    // Breathing: a slow swell through the chest and shoulders.
    p.z += sin(uTime * 1.4) * 0.012 * d;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform sampler2D uDepth;
  uniform vec2 uTexel;
  uniform vec3 uGold;
  uniform vec2 uLight;
  uniform float uHover;
  uniform float uReveal;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uRim;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    // Hologram-style reveal from the bottom up.
    float edge = uReveal * 1.15 - 0.075;
    if (vUv.y > edge) discard;
    float scan = smoothstep(edge - 0.02, edge, vUv.y);

    vec4 base = texture2D(uTex, vUv);
    vec3 col = base.rgb;
    float alpha = base.a;
    if (alpha < 0.03) discard;

    // Surface normal from the depth map.
    float dl = texture2D(uDepth, vUv - vec2(uTexel.x, 0.0)).r;
    float dr = texture2D(uDepth, vUv + vec2(uTexel.x, 0.0)).r;
    float dd = texture2D(uDepth, vUv - vec2(0.0, uTexel.y)).r;
    float du = texture2D(uDepth, vUv + vec2(0.0, uTexel.y)).r;
    vec3 n = normalize(vec3((dl - dr) * 6.0, (dd - du) * 6.0, 1.0));

    vec3 L = normalize(vec3(uLight, 0.9));
    float diff = clamp(dot(n, L), 0.0, 1.0);
    col *= 0.78 + diff * 0.32;

    // Gold rim light on the silhouette edge facing the light.
    float rimEdge = 1.0 - smoothstep(0.0, 0.22, vDepth);
    float facing = clamp(dot(normalize(n.xy + 1e-4), normalize(uLight)) * 0.5 + 0.5, 0.0, 1.0);
    float rim = rimEdge * (0.35 + facing * 0.9);
    col += uGold * rim * uRim;

    // Soft fade at the bottom crop so the bust sits in the scene.
    alpha *= smoothstep(0.0, 0.14, vUv.y);

    // Scanline glow at the reveal edge.
    col = mix(col, uGold * 1.4, scan * 0.9);

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function Bust({ src, depth, state, onReady }: { src: string; depth: string; state: React.MutableRefObject<CharacterState>; onReady: () => void }) {
  const [tex, depthTex] = useLoader(THREE.TextureLoader, [src, depth]);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const reveal = useRef(0);
  const theme = useStore((st) => st.theme);

  const aspect = tex.image ? tex.image.width / tex.image.height : 0.93;
  const mobile = size.width < 768;
  const height = mobile ? viewport.height * 0.9 : viewport.height * 0.98;
  const width = height * aspect;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 96, 104), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uDepth: { value: depthTex },
      uDepthScale: { value: 0.26 },
      uTexel: { value: new THREE.Vector2(1 / 362, 1 / 390) },
      uGold: { value: new THREE.Color("#EBB94A") },
      uLight: { value: new THREE.Vector2(-0.6, 0.5) },
      uHover: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uRim: { value: 0.55 },
    }),
    [tex, depthTex],
  );

  useEffect(() => {
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    depthTex.colorSpace = THREE.NoColorSpace;
    if (depthTex.image) uniforms.uTexel.value.set(1 / depthTex.image.width, 1 / depthTex.image.height);
    onReady();
  }, [tex, depthTex, uniforms, onReady]);

  useEffect(() => {
    uniforms.uRim.value = theme === "dark" ? 0.55 : 0.18;
    uniforms.uGold.value.set(theme === "dark" ? "#EBB94A" : "#B98A2C");
  }, [theme, uniforms]);

  useFrame((clock, delta) => {
    const g = group.current;
    const u = mat.current?.uniforms;
    if (!g || !u) return;
    const s = state.current;
    const t = clock.clock.elapsedTime;
    u.uTime.value = t;
    reveal.current = Math.min(1, reveal.current + delta * 0.55);
    u.uReveal.value = 1 - Math.pow(1 - reveal.current, 3);
    u.uHover.value += (s.hover - u.uHover.value) * 0.08;
    u.uPointer.value.x += (s.px - u.uPointer.value.x) * 0.12;
    u.uPointer.value.y += (s.py - u.uPointer.value.y) * 0.12;
    u.uLight.value.x += (-s.x * 0.9 - 0.2 - u.uLight.value.x) * 0.05;
    u.uLight.value.y += (s.y * 0.6 + 0.45 - u.uLight.value.y) * 0.05;

    const targetY = s.x * 0.2 + Math.sin(t * 0.35) * 0.03;
    const targetX = -s.y * 0.06 + Math.sin(t * 0.5) * 0.01;
    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.position.y = -viewport.height / 2 + height / 2 + Math.sin(t * 0.8) * 0.03;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} scale={[width, height, 1]}>
        <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent premultipliedAlpha blending={THREE.CustomBlending} blendSrc={THREE.OneFactor} blendDst={THREE.OneMinusSrcAlphaFactor} />
      </mesh>
    </group>
  );
}

export default function Character3D({
  src,
  depth,
  state,
  active,
  onReady,
}: {
  src: string;
  depth: string;
  state: React.MutableRefObject<CharacterState>;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      linear
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 32 }}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <Bust src={src} depth={depth} state={state} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
