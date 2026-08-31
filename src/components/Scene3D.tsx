import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";

/* lighter pipeline on phones: no post-processing, no shadow maps, fewer verts */
const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 900));

/* ============================================================ OCEAN */
const OCEAN_VERT = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vCrest;
const float PI = 3.141592653589793;

void main() {
  vec2 q = position.xy;
  vec3 pos = vec3(q, 0.0);
  vec3 N = vec3(0.0, 0.0, 1.0);
  vec2 d; float k, c, A, f, steep, wl;

  float T = uTime * 0.5;

  // long, gentle Adriatic swell
  d = normalize(vec2(1.0, 0.4)); steep = 0.085; wl = 14.0;
  k = 2.0*PI/wl; c = sqrt(9.8/k); A = steep/k; f = k*(dot(d,q) - c*T);
  pos.xy += steep*A*d*cos(f); pos.z += A*sin(f);
  N.xy -= d*k*A*cos(f); N.z -= steep*k*A*sin(f);

  d = normalize(vec2(-0.55, 0.8)); steep = 0.05; wl = 8.0;
  k = 2.0*PI/wl; c = sqrt(9.8/k); A = steep/k; f = k*(dot(d,q) - c*T*1.08);
  pos.xy += steep*A*d*cos(f); pos.z += A*sin(f);
  N.xy -= d*k*A*cos(f); N.z -= steep*k*A*sin(f);

  d = normalize(vec2(0.25, -0.9)); steep = 0.028; wl = 4.5;
  k = 2.0*PI/wl; c = sqrt(9.8/k); A = steep/k; f = k*(dot(d,q) - c*T*1.15);
  pos.xy += steep*A*d*cos(f); pos.z += A*sin(f);
  N.xy -= d*k*A*cos(f); N.z -= steep*k*A*sin(f);

  vCrest = pos.z;
  vNormalW = normalize(mat3(modelMatrix) * N);
  vec4 wp = modelMatrix * vec4(pos, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const OCEAN_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uSky;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uCamPos;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vCrest;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.07; a *= 0.5; }
  return v;
}

void main() {
  vec3 N = normalize(vNormalW);

  // very gentle micro ripple so the surface breathes
  vec2 np = vWorld.xz * 1.7 + vec2(uTime * 0.1, uTime * 0.08);
  float e = 0.09;
  float h0 = fbm(np);
  float hx = fbm(np + vec2(e, 0.0));
  float hy = fbm(np + vec2(0.0, e));
  N = normalize(N + vec3((h0 - hx) / e, 0.0, (h0 - hy) / e) * 0.07);

  vec3 V = normalize(uCamPos - vWorld);

  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  vec3 base = mix(uDeep, uShallow, smoothstep(-0.25, 0.3, vCrest));
  vec3 col = mix(base, uSky, fres * 0.82);

  // soft subsurface glow on crests
  float sss = pow(clamp(dot(normalize(uSunDir + vec3(0.0, 0.3, 0.0)), -V), 0.0, 1.0), 4.0);
  col += vec3(0.05, 0.4, 0.4) * sss * smoothstep(-0.08, 0.25, vCrest) * 0.26;

  // elegant, narrow sun path
  vec3 H = normalize(V + uSunDir);
  float ndh = max(dot(N, H), 0.0);
  float glitter = 0.65 + 0.35 * vnoise(vWorld.xz * 12.0 + uTime * 0.2);
  col += uSunColor * pow(ndh, 750.0) * 2.2 * glitter;
  col += uSunColor * pow(ndh, 60.0) * 0.09;

  // whisper of foam on the highest crests only
  float foamNoise = fbm(vWorld.xz * 2.4 + uTime * 0.07);
  float foam = smoothstep(0.5, 0.85, vCrest) * smoothstep(0.6, 0.9, foamNoise);
  col = mix(col, vec3(0.97, 1.0, 1.0), foam * 0.3);

  float fogF = smoothstep(uFogNear, uFogFar, distance(uCamPos, vWorld));
  col = mix(col, uFogColor, fogF);

  // dithering removes gradient banding on mobile GPUs
  col += (hash(gl_FragCoord.xy + fract(uTime) * 7.0) - 0.5) * 0.014;

  gl_FragColor = vec4(col, 1.0);
}
`;

function Ocean() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color("#0b6f96") },
      uShallow: { value: new THREE.Color("#4ec6de") },
      uSky: { value: new THREE.Color("#daf1f8") },
      uSunDir: { value: new THREE.Vector3(12, 11, -22).normalize() },
      uSunColor: { value: new THREE.Color("#fff3d2") },
      uFogColor: { value: new THREE.Color("#e8f6fc") },
      uFogNear: { value: 18 },
      uFogFar: { value: 55 },
      uCamPos: { value: new THREE.Vector3(0, 1.7, 8.4) },
    }),
    []
  );
  useFrame(({ clock, camera }) => {
    mat.current.uniforms.uTime.value = clock.getElapsedTime();
    mat.current.uniforms.uCamPos.value.copy(camera.position);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
      <planeGeometry args={IS_MOBILE ? [130, 130, 110, 110] : [130, 130, 200, 200]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={OCEAN_VERT} fragmentShader={OCEAN_FRAG} />
    </mesh>
  );
}

/* ============================================================ SKY */
const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
varying vec3 vDir;
void main() {
  float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(h, 0.62));
  float glow = pow(max(dot(normalize(vDir), uSunDir), 0.0), 10.0);
  col += uSunColor * glow * 0.35;
  gl_FragColor = vec4(col, 1.0);
}
`;

function Sky() {
  const uniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Color("#48a4d2") },
      uHorizon: { value: new THREE.Color("#eaf7fc") },
      uSunDir: { value: new THREE.Vector3(12, 11, -22).normalize() },
      uSunColor: { value: new THREE.Color("#fff6da") },
    }),
    []
  );
  return (
    <mesh>
      <sphereGeometry args={[80, 32, 20]} />
      <shaderMaterial uniforms={uniforms} vertexShader={SKY_VERT} fragmentShader={SKY_FRAG} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

/* ============================================================ SHIP */
const L = 3.6;
const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const beamFull = (t: number) =>
  0.85 * Math.pow(Math.sin(Math.PI * t), t > 0.5 ? 0.8 : 0.5) * (1 + 0.14 * Math.pow(Math.abs(2 * t - 1), 2.4));
const depthFull = (t: number) => 0.55 * Math.pow(Math.sin(Math.PI * t), 0.5);
/* fuller transom stern: clamp beam/depth near t=0 */
const beamAt = (t: number) => (t < 0.15 ? THREE.MathUtils.lerp(0.34, beamFull(t), ss(0, 0.15, t)) : beamFull(t));
const depthAt = (t: number) => (t < 0.15 ? THREE.MathUtils.lerp(0.34, depthFull(t), ss(0, 0.15, t)) : depthFull(t));
const sheerAt = (t: number) => 0.3 * Math.pow(Math.abs(t - 0.5) * 2, 1.8);

function buildHull() {
  const SEC = 40;
  const SEG = 18;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const green = new THREE.Color("#1e5b48");
  const green2 = new THREE.Color("#27705a");
  const cream = new THREE.Color("#efe4cc");
  const dark = new THREE.Color("#12333d");

  for (let i = 0; i <= SEC; i++) {
    const t = i / SEC;
    const x = (t - 0.5) * L;
    const w = beamAt(t);
    const d = depthAt(t);
    const s = sheerAt(t);
    for (let j = 0; j <= SEG; j++) {
      const th = (j / SEG) * Math.PI;
      const y = s - d * Math.sin(th);
      positions.push(x, y, w * Math.cos(th));
      let c: THREE.Color;
      if (y > s - 0.13) c = cream;
      else if (y < s - d * 0.8) c = dark;
      else {
        // horizontal strakes (planking runs along the hull)
        const strake = Math.floor(((s - y) / Math.max(d, 0.001)) * 6);
        c = strake % 2 === 0 ? green : green2;
      }
      colors.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < SEC; i++) {
    for (let j = 0; j < SEG; j++) {
      const a = i * (SEG + 1) + j;
      const b = a + SEG + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function buildDeck() {
  const pts: THREE.Vector2[] = [];
  const N = 32;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    pts.push(new THREE.Vector2((t - 0.5) * L * 0.96, beamAt(t) * 0.94));
  }
  for (let i = N - 1; i >= 1; i--) {
    const t = i / N;
    pts.push(new THREE.Vector2((t - 0.5) * L * 0.96, -beamAt(t) * 0.94));
  }
  return new THREE.ShapeGeometry(new THREE.Shape(pts));
}

function buildMainsail() {
  const ROWS = 14;
  const COLS = 10;
  const y0 = 0.95;
  const y1 = 3.15;
  const foot = 1.5;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const cloth = new THREE.Color("#f6efdd");
  const reef = new THREE.Color("#d9cbae");
  for (let r = 0; r <= ROWS; r++) {
    const rf = r / ROWS;
    const y = y0 + (y1 - y0) * rf;
    const w = foot * Math.pow(1 - rf, 0.9);
    const band = (rf > 0.4 && rf < 0.46) || (rf > 0.66 && rf < 0.72);
    const c = band ? reef : cloth;
    for (let cIdx = 0; cIdx <= COLS; cIdx++) {
      const v = cIdx / COLS;
      positions.push(v * w, y, Math.sin(v * Math.PI) * 0.24 * Math.sin(rf * Math.PI));
      colors.push(c.r, c.g, c.b);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let cIdx = 0; cIdx < COLS; cIdx++) {
      const a = r * (COLS + 1) + cIdx;
      const b = a + COLS + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function buildJib() {
  const head = new THREE.Vector3(0, 3.05, 0);
  const tack = new THREE.Vector3(1.75, 0.62, 0);
  const clew = new THREE.Vector3(0.12, 0.85, 0);
  const R = 10;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= R; i++) {
    const u = i / R;
    const edgeA = new THREE.Vector3().lerpVectors(head, tack, u);
    const edgeB = new THREE.Vector3().lerpVectors(head, clew, u);
    for (let j = 0; j <= R - i + 1; j++) {
      const v = j / Math.max(R - i + 1, 1);
      const p = new THREE.Vector3().lerpVectors(edgeA, edgeB, v);
      positions.push(p.x, p.y, -Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.14);
    }
  }
  let rowStart = 0;
  for (let i = 0; i < R; i++) {
    const colsThis = R - i + 2;
    const colsNext = R - i + 1;
    for (let j = 0; j < colsNext - 1; j++) {
      const a = rowStart + j;
      const b = rowStart + colsThis + j;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
    rowStart += colsThis;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function Stay({ a, b, r = 0.012 }: { a: [number, number, number]; b: [number, number, number]; r?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: va.clone().add(vb).multiplyScalar(0.5), quat, len };
  }, [a, b, r]);
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 6]} />
      <meshStandardMaterial color="#e8dcc2" roughness={0.8} />
    </mesh>
  );
}

const jibMat = new THREE.MeshStandardMaterial({ color: "#f6efdd", roughness: 0.85, side: THREE.DoubleSide });
const woodMat = new THREE.MeshStandardMaterial({ color: "#7a4a2a", roughness: 0.75 });
const darkWood = new THREE.MeshStandardMaterial({ color: "#4a2c18", roughness: 0.7 });

function Ship() {
  const group = useRef<THREE.Group>(null!);
  const hull = useMemo(buildHull, []);
  const deck = useMemo(buildDeck, []);
  const mainsail = useMemo(buildMainsail, []);
  const jib = useMemo(buildJib, []);

  const tubeLoop = (yOff: number, zScale: number, xScale: number) => {
    const pts: THREE.Vector3[] = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      pts.push(new THREE.Vector3((t - 0.5) * L * xScale, sheerAt(t) + yOff, beamAt(t) * zScale));
    }
    for (let i = N - 1; i >= 1; i--) {
      const t = i / N;
      pts.push(new THREE.Vector3((t - 0.5) * L * xScale, sheerAt(t) + yOff, -beamAt(t) * zScale));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  };

  const gunwale = useMemo(() => new THREE.TubeGeometry(tubeLoop(0.02, 1, 1), 120, 0.05, 8, true), []);
  const rail = useMemo(() => new THREE.TubeGeometry(tubeLoop(0.27, 0.97, 0.985), 120, 0.016, 6, true), []);

  const stanchionTs = useMemo(() => [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92], []);

  const nameTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#efe4cc";
      ctx.font = "600 58px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("IL PORTOLOTTO", 256, 52);
      ctx.font = "400 30px Georgia, serif";
      ctx.fillStyle = "#c9b98f";
      ctx.fillText("· RIMINI ·", 256, 102);
    }
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.z = Math.sin(t * 0.45) * 0.04;
    group.current.rotation.x = Math.cos(t * 0.33) * 0.035;
    group.current.rotation.y = -0.5 + Math.sin(t * 0.2) * 0.015;
    group.current.position.y = Math.sin(t * 0.7) * 0.09;
  });

  return (
    <group ref={group} position={[0.5, 0.02, 0]} rotation={[0, -0.5, 0]}>
      <mesh geometry={hull} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* transom cap */}
      <group position={[-L / 2 + 0.02, sheerAt(0) - 0.16, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh scale={[0.33, 0.17, 1]}>
          <circleGeometry args={[1, 24]} />
          <meshStandardMaterial color="#1a4f3e" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh geometry={gunwale} castShadow>
        <meshStandardMaterial color="#3f2413" roughness={0.55} />
      </mesh>
      <mesh geometry={deck} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial color="#d9c49a" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* keel */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2.2, 0.22, 0.06]} />
        <meshStandardMaterial color="#12333d" roughness={0.6} />
      </mesh>
      {/* stem post */}
      <mesh position={[1.72, 0.18, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.07, 0.9, 0.07]} />
        <meshStandardMaterial color="#3f2413" roughness={0.6} />
      </mesh>
      {/* hatch */}
      <mesh position={[0.55, 0.1, 0]} material={woodMat} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
      </mesh>
      {/* wheelhouse */}
      <group position={[-1.0, 0.02, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.62, 0.52, 0.66]} />
          <meshStandardMaterial color="#efe6d2" roughness={0.8} />
        </mesh>
        <mesh position={[0.02, 0.62, 0]} castShadow>
          <boxGeometry args={[0.72, 0.07, 0.76]} />
          <meshStandardMaterial color="#b3402a" roughness={0.7} />
        </mesh>
        <mesh position={[0.32, 0.38, 0.18]}>
          <boxGeometry args={[0.02, 0.16, 0.16]} />
          <meshStandardMaterial color="#ffd98a" emissive="#ffca6e" emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0.32, 0.38, -0.18]}>
          <boxGeometry args={[0.02, 0.16, 0.16]} />
          <meshStandardMaterial color="#ffd98a" emissive="#ffca6e" emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0, 0.3, 0.335]}>
          <planeGeometry args={[0.56, 0.14]} />
          <meshBasicMaterial map={nameTex} transparent />
        </mesh>
        <mesh position={[0, 0.3, -0.335]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.56, 0.14]} />
          <meshBasicMaterial map={nameTex} transparent />
        </mesh>
      </group>
      {/* handrail + stanchions */}
      <mesh geometry={rail}>
        <meshStandardMaterial color="#e8dcc2" roughness={0.6} />
      </mesh>
      {stanchionTs.map((t) =>
        [-1, 1].map((side) => (
          <mesh key={`${t}-${side}`} position={[(t - 0.5) * L * 0.985, sheerAt(t) + 0.14, side * beamAt(t) * 0.97]}>
            <cylinderGeometry args={[0.012, 0.012, 0.26, 6]} />
            <meshStandardMaterial color="#e8dcc2" roughness={0.6} />
          </mesh>
        ))
      )}
      {/* net pile */}
      <group position={[1.0, 0.16, 0.18]}>
        <mesh scale={[1, 0.55, 1]}>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshStandardMaterial color="#8a6f42" roughness={0.95} />
        </mesh>
        <mesh scale={[1.02, 0.57, 1.02]}>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshStandardMaterial color="#5e4a28" wireframe />
        </mesh>
      </group>
      {/* barrel */}
      <group position={[-0.35, 0.02, 0.5]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.11, 0.3, 12]} />
          <meshStandardMaterial color="#7a4a2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.125, 0.012, 6, 18]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.125, 0.012, 6, 18]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>
      {/* mast */}
      <mesh position={[0.25, 1.7, 0]} rotation={[0, 0, 0.03]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 3.1, 10]} />
        <meshStandardMaterial color="#5a3620" roughness={0.7} />
      </mesh>
      {/* bowsprit */}
      <mesh position={[1.55, 0.5, 0]} rotation={[0, 0, -1.25]} material={darkWood}>
        <cylinderGeometry args={[0.025, 0.035, 1.1, 8]} />
      </mesh>
      {/* boom + mainsail */}
      <group position={[0.27, 0, 0]} rotation={[0, -0.42, 0]}>
        <mesh position={[0.62, 0.93, 0]} rotation={[0, 0, Math.PI / 2 - 0.03]} material={darkWood}>
          <cylinderGeometry args={[0.026, 0.026, 1.55, 8]} />
        </mesh>
        <mesh geometry={mainsail} castShadow>
          <meshStandardMaterial vertexColors roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* jib */}
      <mesh geometry={jib} position={[0.25, 0, 0]} castShadow material={jibMat} />
      {/* rigging */}
      <Stay a={[0.25, 3.15, 0]} b={[1.95, 0.55, 0]} />
      <Stay a={[0.25, 3.15, 0]} b={[-1.7, 0.35, 0]} />
      <Stay a={[0.25, 3.0, 0]} b={[0.1, 0.1, 0.78]} />
      <Stay a={[0.25, 3.0, 0]} b={[0.1, 0.1, -0.78]} />
      {/* lantern + flag */}
      <mesh position={[0.25, 3.28, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#ffd9a0" emissive="#ffb45c" emissiveIntensity={3.2} />
      </mesh>
      <pointLight position={[0.25, 3.3, 0]} color="#ffb45c" intensity={3} distance={7} decay={2} />
      <mesh position={[0.22, 3.42, 0.12]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[0.3, 0.16]} />
        <meshStandardMaterial color="#d84a26" side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ============================================================ foam + ripples */
function Ripple() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() % 3.2) / 3.2;
    ref.current.scale.setScalar(1 + t * 0.55);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.22 * (1 - t);
  });
  return (
    <mesh ref={ref} position={[0.5, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 1.72, 56]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function FoamRing({ position, r, phase }: { position: [number, number, number]; r: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.6 + phase) % 1;
    ref.current.scale.setScalar(1 + t * 0.4);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.28 * (1 - t);
  });
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r, r + 0.09, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/* ============================================================ mooring */
function Mooring() {
  const rope = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.15, 0.42, 0.92),
      new THREE.Vector3(2.7, 0.12, 1.4),
      new THREE.Vector3(3.25, 0.52, 1.95),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.02, 6, false);
  }, []);
  return (
    <group>
      <mesh geometry={rope}>
        <meshStandardMaterial color="#caa96a" roughness={0.9} />
      </mesh>
      <mesh position={[3.3, 0.05, 2.0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.6, 10]} />
        <meshStandardMaterial color="#4a2c18" roughness={0.85} />
      </mesh>
      <mesh position={[3.7, -0.05, 2.45]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 1.4, 10]} />
        <meshStandardMaterial color="#3a2416" roughness={0.85} />
      </mesh>
      <FoamRing position={[3.3, -0.5, 2.0]} r={0.16} phase={0.2} />
      <FoamRing position={[3.7, -0.5, 2.45]} r={0.14} phase={0.6} />
    </group>
  );
}

/* ============================================================ scenery */
function Lighthouse() {
  return (
    <group position={[-16, 0.6, -24]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.62, 3.2, 14]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.44, 0.46, 0.5, 14]} />
        <meshStandardMaterial color="#d84a26" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.5, 12]} />
        <meshStandardMaterial color="#2b4a58" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.72, 0]}>
        <coneGeometry args={[0.36, 0.3, 12]} />
        <meshStandardMaterial color="#d84a26" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Buoy({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.7}>
      <group position={position}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <coneGeometry args={[0.07, 0.18, 10]} />
          <meshStandardMaterial color="#f4efe4" roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function Sun() {
  return (
    <group position={[12, 11, -22]}>
      <mesh>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshStandardMaterial color="#fffdf4" emissive="#fff3cf" emissiveIntensity={2.6} roughness={1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.6, 24, 24]} />
        <meshBasicMaterial color="#fff3cf" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ============================================================ rig */
function Rig() {
  useFrame(({ camera, pointer, clock }) => {
    const t = clock.getElapsedTime();
    const idle = Math.sin(t * 0.05) * 0.7;
    const tx = idle + pointer.x * 1.0;
    const ty = 1.7 + pointer.y * 0.5;
    camera.position.x += (tx - camera.position.x) * 0.035;
    camera.position.y += (ty - camera.position.y) * 0.035;
    camera.lookAt(0.4, 0.8, 0);
  });
  return null;
}

/* ============================================================ real models loader */
function ExternalModels() {
  const [ship, setShip] = useState<THREE.Object3D | null>(null);
  const [sea, setSea] = useState<THREE.Object3D | null>(null);
  const shipRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let alive = true;
    const baseUrl = import.meta.env.BASE_URL;

    loader.load(
      `${baseUrl}models/format1.glb`,
      (g) => {
        if (!alive) return;
        g.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
          }
        });
        setShip(g.scene);
      },
      undefined,
      (err) => console.log("Fallback su barca procedurale:", err)
    );

    loader.load(
      `${baseUrl}models/mar.glb`,
      (g) => {
        if (alive) setSea(g.scene);
      },
      undefined,
      (err) => console.log("Fallback su mare procedurale:", err)
    );

    return () => {
      alive = false;
      dracoLoader.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    if (!shipRef.current) return;
    const t = clock.getElapsedTime();
    shipRef.current.rotation.z = Math.sin(t * 0.45) * 0.04;
    shipRef.current.rotation.x = Math.cos(t * 0.33) * 0.035;
    shipRef.current.position.y = 0.02 + Math.sin(t * 0.7) * 0.09;
  });

  return (
    <>
      {sea ? <primitive object={sea} position={[0, -0.5, 0]} /> : <Ocean />}
      {ship ? (
        <group ref={shipRef} position={[0.5, 0.02, 0]} rotation={[0, -0.5, 0]}>
          <primitive object={ship} />
        </group>
      ) : (
        <Ship />
      )}
    </>
  );
}

/* ============================================================ scene */
export default function Scene3D() {
  return (
    <Canvas
      shadows={!IS_MOBILE}
      dpr={IS_MOBILE ? [1, 1.25] : [1, 1.6]}
      camera={{ position: [0, 1.7, 8.4], fov: 42 }}
      gl={{ antialias: !IS_MOBILE, powerPreference: "high-performance" }}
      aria-hidden
    >
      <fog attach="fog" args={["#e8f6fc", 20, 55]} />

      <ambientLight intensity={0.65} color="#d8eef8" />
      <directionalLight
        position={[12, 12, -16]}
        intensity={1.7}
        color="#fff2d0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <hemisphereLight args={["#bfe6f2", "#cfe0e4", 0.6]} />

      <Sky />
      <ExternalModels />
      <Ripple />
      <Mooring />
      <FoamRing position={[-3.6, -0.5, 1.8]} r={0.3} phase={0} />
      <FoamRing position={[5.0, -0.5, -2.4]} r={0.3} phase={0.45} />
      <Lighthouse />
      <Sun />
      <Buoy position={[-3.6, -0.42, 1.8]} color="#e4572e" />
      <Buoy position={[5.0, -0.45, -2.4]} color="#d9a441" />

      {!IS_MOBILE && (
        <Sparkles count={40} scale={[10, 3, 8]} position={[0.5, 0.6, 0]} size={2.6} speed={0.3} color="#ffffff" opacity={0.7} />
      )}

      {!IS_MOBILE && (
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={1.15} luminanceSmoothing={0.25} />
          <Vignette eskil={false} offset={0.24} darkness={0.22} />
        </EffectComposer>
      )}

      <Rig />
    </Canvas>
  );
}
