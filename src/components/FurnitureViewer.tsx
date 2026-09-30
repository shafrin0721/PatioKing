"use client";

import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import { Bounds, ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { resolveFurnitureModel } from "./FurnitureConfiguration";
import type { FurnitureConfiguration, FurnitureProductSource } from "./FurnitureConfiguration";

type Surface = "wood" | "upholstery" | "metal";
type Palette = Record<Surface, string> & { upholsteryRoughness: number };

const finishColors: Record<string, string> = { Natural: "#9a6b43", "Honey Oak": "#c58b4d", "Dark Walnut": "#3a2723", "Matte Black": "#242526", Whitewash: "#d5cec2" };
const fabricColors: Record<string, string> = { Linen: "#c9c0ae", "Cotton Blend": "#a9ada7", "Performance Velvet": "#526b64", "Outdoor Canvas": "#b5a78e", Leather: "#704838" };
const fabricRoughness: Record<string, number> = { Linen: 0.94, "Cotton Blend": 0.9, "Performance Velvet": 0.84, "Outdoor Canvas": 0.96, Leather: 0.58 };
const accentColors: Record<string, string> = { "Warm Neutral": "#bcae9d", "Forest Green": "#315348", Terracotta: "#a85f43", Charcoal: "#3c4142", "Natural Wood": "#a2783e" };

function paletteFor(configuration: FurnitureConfiguration, kind: string): Palette {
  const materialColors: Record<string, string> = { "Premium Wood": "#9a6b43", "Natural Rattan": "#c39a61", "Premium Upholstery": "#9a6b43", Teak: "#a85d3c", Walnut: "#4a2d25", "Weather-resistant Aluminium": "#798384" };
  const upholstered = ["chair", "sofa", "bed", "ottoman"].includes(kind);
  const colorOverride = configuration.color !== "Warm Neutral" ? accentColors[configuration.color] : undefined;
  const wood = configuration.finish === "Natural" ? materialColors[configuration.material] ?? "#9a6b43" : finishColors[configuration.finish] ?? "#9a6b43";
  return {
    wood: !upholstered && colorOverride ? colorOverride : wood,
    upholstery: upholstered && colorOverride && configuration.color !== "Natural Wood" ? colorOverride : fabricColors[configuration.upholstery] ?? "#c9c0ae",
    metal: configuration.material === "Weather-resistant Aluminium" ? materialColors[configuration.material] : "#858986",
    upholsteryRoughness: fabricRoughness[configuration.upholstery] ?? 0.94,
  };
}

function Box({ size, position, color, roughness = 0.78, radius = 0 }: { size: [number, number, number]; position: [number, number, number]; color: string; roughness?: number; radius?: number }) {
  return <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={roughness} metalness={radius} />
  </mesh>;
}

function FurnitureShape({ product, configuration }: { product: FurnitureProductSource; configuration: FurnitureConfiguration }) {
  const model = resolveFurnitureModel(product);
  const palette = paletteFor(configuration, model.kind);
  const width = configuration.width / 100;
  const depth = configuration.length / 100;
  const height = configuration.height / 100;
  const topY = height - Math.max(0.035, height * 0.07);
  const supportHeight = model.kind === "table" ? topY : model.kind === "chair" ? height * 0.45 : model.kind === "bed" ? height * 0.17 : model.kind === "ottoman" ? height * 0.23 : height * 0.11;
  const legHeight = Math.max(0.06, supportHeight);
  const styleLegScale = configuration.style === "Minimal" ? 0.72 : configuration.style === "Traditional" ? 1.18 : configuration.style === "Contemporary" ? 0.9 : 1;
  const legWidth = Math.max(0.035, Math.min(width, depth) * 0.045 * styleLegScale);
  const footColor = configuration.material === "Weather-resistant Aluminium" ? palette.metal : palette.wood;
  const traditional = configuration.style === "Traditional";

  if (model.kind === "table") {
    const supportCount = configuration.capacity === "8 Seater" ? 6 : 4;
    return <group>
      <Box size={[width, height * 0.07, depth]} position={[0, topY, 0]} color={palette.wood} />
      <Box size={[width * 0.85, height * 0.05, depth * 0.78]} position={[0, topY - height * 0.07, 0]} color={palette.wood} />
      {Array.from({ length: supportCount }, (_, index) => {
        const alongWidth = index >= 4;
        const position: [number, number, number] = alongWidth
          ? [index === 4 ? -width * 0.35 : width * 0.35, legHeight / 2, 0]
          : [index % 2 === 0 ? -width * 0.43 : width * 0.43, legHeight / 2, index < 2 ? -depth * 0.42 : depth * 0.42];
        return traditional
          ? <mesh key={index} position={position} castShadow><cylinderGeometry args={[legWidth * 0.75, legWidth, legHeight, 12]} /><meshStandardMaterial color={footColor} roughness={0.52} /></mesh>
          : <Box key={index} size={[legWidth, legHeight, legWidth]} position={position} color={footColor} />;
      })}
    </group>;
  }

  if (model.kind === "chair") {
    const seatY = height * 0.45;
    const seatDepth = depth * 0.62;
    const reclining = /relaxing|rocking/.test(`${product.category} ${product.id}`.toLowerCase());
    return <group>
      <Box size={[width * 0.9, height * 0.07, seatDepth]} position={[0, seatY, depth * 0.06]} color={palette.wood} />
      <Box size={[width * 0.84, height * 0.11, seatDepth * 0.94]} position={[0, seatY + height * 0.08, depth * 0.06]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />
      <Box size={[width * 0.88, height * (reclining ? 0.52 : 0.48), height * 0.075]} position={[0, seatY + height * 0.3, -depth * 0.37]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />
      {!/rocking/.test(`${product.category} ${product.id}`.toLowerCase()) && [-1, 1].map((side) => <Box key={side} size={[legWidth, legHeight, legWidth]} position={[side * width * 0.39, legHeight / 2, depth * 0.27]} color={footColor} />)}
      {!/rocking/.test(`${product.category} ${product.id}`.toLowerCase()) && [-1, 1].map((side) => <Box key={side} size={[legWidth, legHeight, legWidth]} position={[side * width * 0.39, legHeight / 2, -depth * 0.29]} color={footColor} />)}
      {/rocking/.test(`${product.category} ${product.id}`.toLowerCase()) && [-1, 1].map((side) => {
        const path = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * width * 0.39, height * 0.13, -depth * 0.47),
          new THREE.Vector3(side * width * 0.39, height * 0.06, -depth * 0.24),
          new THREE.Vector3(side * width * 0.39, height * 0.045, 0),
          new THREE.Vector3(side * width * 0.39, height * 0.06, depth * 0.24),
          new THREE.Vector3(side * width * 0.39, height * 0.13, depth * 0.47),
        ]);
        return <mesh key={side} castShadow><tubeGeometry args={[path, 24, legWidth * 0.55, 8, false]} /><meshStandardMaterial color={footColor} roughness={0.55} /></mesh>;
      })}
      {reclining && [-1, 1].map((side) => <Box key={side} size={[legWidth * 1.4, height * 0.06, depth * 0.48]} position={[side * width * 0.46, seatY + height * 0.16, depth * 0.02]} color={palette.wood} />)}
    </group>;
  }

  if (model.kind === "sofa") {
    const seats = Math.max(2, Math.min(5, Number.parseInt(configuration.capacity, 10) || 3));
    const baseY = height * 0.2;
    const lShape = /l sofa/.test(`${product.category} ${product.id}`.toLowerCase());
    const roundShape = /round sofa/.test(`${product.category} ${product.id}`.toLowerCase());
    if (roundShape) {
      const radius = Math.min(width, depth) * 0.47;
      return <group>
        <mesh position={[0, baseY, 0]} castShadow receiveShadow><cylinderGeometry args={[radius, radius, height * 0.2, 40]} /><meshStandardMaterial color={palette.wood} roughness={0.7} /></mesh>
        <mesh position={[0, baseY + height * 0.13, 0]} castShadow receiveShadow><cylinderGeometry args={[radius * 0.94, radius * 0.94, height * 0.12, 40]} /><meshStandardMaterial color={palette.upholstery} roughness={palette.upholsteryRoughness} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height * 0.61, 0]} castShadow><torusGeometry args={[radius * 0.76, height * 0.13, 12, 48]} /><meshStandardMaterial color={palette.upholstery} roughness={palette.upholsteryRoughness} /></mesh>
        {[-1, 1].flatMap((x) => [-1, 1].map((z) => <Box key={`${x}-${z}`} size={[legWidth, legHeight, legWidth]} position={[x * width * 0.34, legHeight / 2, z * depth * 0.34]} color={footColor} />))}
      </group>;
    }
    return <group>
      <Box size={[width * 0.9, height * 0.18, depth * 0.76]} position={[0, baseY, -depth * 0.04]} color={palette.wood} />
      {Array.from({ length: seats }, (_, index) => <Box key={index} size={[width * 0.82 / seats, height * 0.16, depth * 0.66]} position={[-width * 0.41 + width * 0.82 / seats * (index + 0.5), baseY + height * 0.15, depth * 0.02]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />)}
      <Box size={[width * 0.86, height * 0.38, height * 0.13]} position={[0, height * 0.63, -depth * 0.34]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />
      {[-1, 1].map((side) => <Box key={side} size={[width * (traditional ? 0.13 : 0.1), height * 0.48, depth * 0.76]} position={[side * width * 0.4, height * 0.42, -depth * 0.04]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />)}
      {lShape && <Box size={[width * 0.48, height * 0.16, depth * 0.42]} position={[width * 0.2, baseY + height * 0.15, depth * 0.48]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />}
      {[-1, 1].map((side) => <Box key={side} size={[legWidth, legHeight, legWidth]} position={[side * width * 0.38, legHeight / 2, depth * 0.28]} color={footColor} />)}
    </group>;
  }

  if (model.kind === "bed") {
    return <group>
      <Box size={[width * 0.94, height * 0.22, depth * 0.94]} position={[0, height * 0.28, 0]} color={palette.wood} />
      <Box size={[width * 0.9, height * 0.18, depth * 0.88]} position={[0, height * 0.49, depth * 0.015]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />
      <Box size={[width, height * 0.46, height * 0.09]} position={[0, height * 0.54, -depth * 0.47]} color={palette.wood} />
      {[-1, 1].map((side) => <Box key={side} size={[width * 0.24, height * 0.08, depth * 0.17]} position={[side * width * 0.25, height * 0.64, -depth * 0.3]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />)}
      {[-1, 1].map((side) => <Box key={side} size={[legWidth, legHeight, legWidth]} position={[side * width * 0.42, legHeight / 2, depth * 0.42]} color={footColor} />)}
    </group>;
  }

  if (model.kind === "ottoman") {
    return <group>
      <Box size={[width * 0.9, height * 0.68, depth * 0.9]} position={[0, height * 0.57, 0]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />
      <Box size={[width * 0.94, height * 0.08, depth * 0.94]} position={[0, height * 0.94, 0]} color={palette.upholstery} roughness={palette.upholsteryRoughness} />
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => <Box key={`${x}-${z}`} size={[legWidth, legHeight, legWidth]} position={[x * width * 0.36, legHeight / 2, z * depth * 0.36]} color={footColor} />))}
    </group>;
  }

  const isDresser = /dresser|dressing/.test(`${product.category} ${product.id}`.toLowerCase());
  const panelCount = isDresser ? 3 : /wardrobe/.test(`${product.category} ${product.id}`.toLowerCase()) ? 3 : 2;
  return <group>
    <Box size={[width * 0.94, height * 0.82, depth * 0.82]} position={[0, height * 0.52, 0]} color={palette.wood} />
    <Box size={[width, height * 0.06, depth * 0.88]} position={[0, height * 0.96, 0]} color={palette.wood} />
    {Array.from({ length: panelCount }, (_, index) => {
      const panelHeight = height * 0.76 / panelCount;
      const panelWidth = isDresser ? width * 0.86 : width * 0.86 / panelCount;
      const x = isDresser ? 0 : -width * 0.43 + panelWidth * (index + 0.5);
      const y = isDresser ? height * 0.87 - panelHeight * (index + 0.5) : height * 0.53;
      return <group key={index}>
        <Box size={[panelWidth * 0.96, panelHeight * (isDresser ? 0.9 : 0.94), depth * 0.035]} position={[x, y, depth * 0.43]} color={palette.wood} />
        <mesh position={[x + panelWidth * 0.37, y, depth * 0.46]} castShadow><sphereGeometry args={[Math.min(0.018, height * 0.025), 12, 10]} /><meshStandardMaterial color={palette.metal} metalness={0.6} roughness={0.3} /></mesh>
      </group>;
    })}
    {[-1, 1].map((side) => <Box key={side} size={[legWidth, legHeight, legWidth]} position={[side * width * 0.4, legHeight / 2, depth * 0.32]} color={footColor} />)}
  </group>;
}

function ViewerScene({ product, configuration, controlsRef }: { product: FurnitureProductSource; configuration: FurnitureConfiguration; controlsRef: MutableRefObject<OrbitControlsImpl | null> }) {
  return <>
    <color attach="background" args={["#eeeae4"]} />
    <ambientLight intensity={1.4} />
    <directionalLight castShadow position={[3, 5, 4]} intensity={2.1} shadow-mapSize={[2048, 2048]} />
    <directionalLight position={[-3, 2, -2]} intensity={0.7} color="#fff4e5" />
    <Environment preset="studio" />
    <Bounds fit clip observe margin={1.25}>
      <Suspense fallback={null}>
        <FurnitureShape product={product} configuration={configuration} />
      </Suspense>
    </Bounds>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[12, 64]} />
      <meshStandardMaterial color="#d5cec4" roughness={1} />
    </mesh>
    <ContactShadows position={[0, 0, 0]} opacity={0.32} scale={8} blur={2.5} far={8} />
    <OrbitControls ref={controlsRef} enablePan={false} minDistance={1.1} maxDistance={16} minPolarAngle={0.3} maxPolarAngle={Math.PI - 0.3} makeDefault />
  </>;
}

export function FurnitureViewer({ product, configuration }: { product: FurnitureProductSource; configuration: FurnitureConfiguration }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  return <div className="furniture-3d-viewer" aria-label={`Interactive 3D preview of ${product.name}`}>
    <Canvas shadows="percentage" fallback={<div className="viewer-unavailable">Interactive preview unavailable in this browser.</div>} dpr={[1, 1.75]} camera={{ position: [4, 3, 5], fov: 34 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}>
      <ViewerScene product={product} configuration={configuration} controlsRef={controlsRef} />
    </Canvas>
    <div className="viewer-status"><span>INTERACTIVE 3D PREVIEW</span><small>{product.name.toUpperCase()}</small></div>
    <div className="viewer-controls">
      <button type="button" onClick={() => controlsRef.current?.reset()} aria-label="Reset view" title="Reset view"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /></svg></button>
      <button type="button" onClick={() => controlsRef.current?.dollyIn(1.2)} aria-label="Zoom in" title="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5M10.8 7.8v6M7.8 10.8h6" /></svg></button>
      <button type="button" onClick={() => controlsRef.current?.dollyOut(1.2)} aria-label="Zoom out" title="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5M7.8 10.8h6" /></svg></button>
    </div>
  </div>;
}