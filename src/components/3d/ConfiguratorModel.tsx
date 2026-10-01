"use client";

import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { FurnitureConfiguration } from "@/components/FurnitureConfiguration";
import { productModelVariants } from "@/lib/productModelMap";

const woodColors: Record<string, string> = {
  "Premium Wood": "#9a6b43",
  "Natural Rattan": "#c39a61",
  "Premium Upholstery": "#9a6b43",
  Teak: "#a85d3c",
  Walnut: "#4a2d25",
  "Weather-resistant Aluminium": "#798384",
};
const finishColors: Record<string, string> = {
  Natural: "#9a6b43",
  "Honey Oak": "#c58b4d",
  "Dark Walnut": "#3a2723",
  "Matte Black": "#242526",
  Whitewash: "#d5cec2",
};
const fabricColors: Record<string, string> = {
  Linen: "#c9c0ae",
  "Cotton Blend": "#a9ada7",
  "Performance Velvet": "#526b64",
  "Outdoor Canvas": "#b5a78e",
  Leather: "#704838",
};
const accentColors: Record<string, string> = {
  "Warm Neutral": "#bcae9d",
  "Forest Green": "#315348",
  Terracotta: "#a85f43",
  Charcoal: "#3c4142",
  "Natural Wood": "#a2783e",
};

type ModelProps = {
  modelPath: string;
  configuration: FurnitureConfiguration;
  initialDimensions: { width: number; depth: number; height: number };
  onBounds: (size: THREE.Vector3) => void;
  onError: (error: Error) => void;
};

function materialList(material: THREE.Material | THREE.Material[]) {
  return Array.isArray(material) ? material : [material];
}

function ConfigurableGLB({ modelPath, configuration, initialDimensions, onBounds, onError }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    clone.rotation.x = -Math.PI / 2;
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      let geometry = object.geometry.clone();
      if (!geometry.getAttribute("normal")) {
        const flatGeometry = geometry.toNonIndexed();
        geometry.dispose();
        geometry = flatGeometry;
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
      }
      object.geometry = geometry;
      object.material = Array.isArray(object.material)
        ? object.material.map((material) => material.clone())
        : object.material.clone();
    });
    clone.updateMatrixWorld(true);
    const sourceBounds = new THREE.Box3().setFromObject(clone);
    const center = sourceBounds.getCenter(new THREE.Vector3());
    const sourceSize = sourceBounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
    if (!Number.isFinite(maxDimension) || maxDimension <= 0) return { model: clone, size: null, center, sourceSize, maxDimension, scale: 1 };
    const scale = 2.4 / maxDimension;
    clone.scale.setScalar(scale);
    clone.position.copy(center).multiplyScalar(-scale);
    clone.updateMatrixWorld(true);
    return { model: clone, size: new THREE.Box3().setFromObject(clone).getSize(new THREE.Vector3()), center, sourceSize, maxDimension, scale };
  }, [scene]);
  const { model } = prepared;

  useLayoutEffect(() => {
    if (!prepared.size) {
      onError(new Error(`The GLB contains no measurable geometry: ${modelPath}`));
      return;
    }

    const dimensionScale = {
      x: configuration.width / initialDimensions.width,
      y: configuration.height / initialDimensions.height,
      z: configuration.length / initialDimensions.depth,
    };
    model.scale.set(prepared.scale * dimensionScale.x, prepared.scale * dimensionScale.y, prepared.scale * dimensionScale.z);
    model.position.set(
      -prepared.center.x * prepared.scale * dimensionScale.x,
      -prepared.center.y * prepared.scale * dimensionScale.y,
      -prepared.center.z * prepared.scale * dimensionScale.z,
    );
    model.updateMatrixWorld(true);

    const productVariant = productModelVariants[configuration.productId];
    const hiddenMeshNames = new Set(productVariant?.hiddenMeshNames ?? []);
    const hiddenMaterialNames = new Set((productVariant?.hiddenMaterialNames ?? []).map((name) => name.toLowerCase()));
    let meshCount = 0;
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      meshCount += 1;
      const materials = materialList(child.material);
      child.visible = !hiddenMeshNames.has(child.name)
        && !materials.some((material) => hiddenMaterialNames.has(material.name.toLowerCase()));
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false;
      for (const material of materials) {
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
        if ("opacity" in material && material.opacity <= 0) {
          material.opacity = 1;
          material.transparent = false;
          material.needsUpdate = true;
        }
      }
      if (process.env.NODE_ENV === "development") {
        console.log("3D mesh:", JSON.stringify({ name: child.name, visible: child.visible, positionCount: child.geometry.getAttribute("position")?.count, materials: materials.map((material) => ({ name: material.name, type: material.type, opacity: material instanceof THREE.MeshStandardMaterial ? material.opacity : undefined })) }));
      }
    });
    if (meshCount === 0) {
      onError(new Error(`The GLB scene contains no meshes: ${modelPath}`));
      return;
    }
    if (process.env.NODE_ENV === "development") console.log("3D model bounds:", JSON.stringify({ modelPath, center: prepared.center.toArray(), originalSize: prepared.sourceSize.toArray(), fittedSize: prepared.size.toArray(), maxDimension: prepared.maxDimension, normalizedScale: prepared.scale, meshCount }));
    const fittedSize = new THREE.Vector3(prepared.size.x * dimensionScale.x, prepared.size.y * dimensionScale.y, prepared.size.z * dimensionScale.z);
    if (process.env.NODE_ENV === "development") console.log("3D dimensions applied:", JSON.stringify({ width: configuration.width, length: configuration.length, height: configuration.height, dimensionScale, fittedSize: fittedSize.toArray() }));
    onBounds(fittedSize);
  }, [model, modelPath, onBounds, onError, prepared, configuration.productId, configuration.width, configuration.length, configuration.height, initialDimensions.width, initialDimensions.depth, initialDimensions.height]);

  useEffect(() => {
    const materialWood = configuration.finish === "Natural"
      ? woodColors[configuration.material] ?? woodColors["Premium Wood"]
      : finishColors[configuration.finish] ?? woodColors["Premium Wood"];
    const fabric = configuration.color !== "Warm Neutral" && configuration.color !== "Natural Wood"
      ? accentColors[configuration.color]
      : fabricColors[configuration.upholstery] ?? "#c9c0ae";
    const wood = configuration.color !== "Warm Neutral" && configuration.color !== "Natural Wood" && !/sofa|chair|bed|divan|ottoman/i.test(configuration.category)
      ? accentColors[configuration.color]
      : materialWood;
    const productVariant = productModelVariants[configuration.productId];
    const useImageMatchedDefaults = configuration.finish === "Natural"
      && configuration.color === "Warm Neutral"
      && configuration.material === "Premium Wood";

    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const imageMatchedColor = useImageMatchedDefaults ? productVariant?.defaultMeshColors?.[object.name] : undefined;
      for (const material of materialList(object.material)) {
        const name = material.name.toLowerCase();
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        if (imageMatchedColor) {
          material.color.set(imageMatchedColor);
          material.roughness = 0.78;
          material.needsUpdate = true;
        } else if (/fabric|upholstery|textile|leather/.test(name)) {
          material.color.set(fabric);
          material.roughness = configuration.upholstery === "Leather" ? 0.58 : 0.92;
          material.needsUpdate = true;
        } else if (/wood|timber|rattan/.test(name)) {
          material.color.set(wood);
          material.needsUpdate = true;
        } else if (/metal|aluminium|aluminum/.test(name) && configuration.material === "Weather-resistant Aluminium") {
          material.color.set(woodColors[configuration.material]);
          material.needsUpdate = true;
        }
      }
    });
  }, [model, configuration.productId, configuration.color, configuration.category, configuration.finish, configuration.material, configuration.upholstery]);

  return <primitive object={model} dispose={null} />;
}

function CameraFit({ size, controlsRef, fitDistanceRef }: { size: THREE.Vector3 | null; controlsRef: MutableRefObject<OrbitControlsImpl | null>; fitDistanceRef: MutableRefObject<number> }) {
  const viewport = useThree((state) => state.size);
  const camera = useRef(useThree((state) => state.camera));

  useEffect(() => {
    const activeCamera = camera.current;
    if (!size || !(activeCamera instanceof THREE.PerspectiveCamera) || !controlsRef.current) return;
    const radius = Math.max(size.length() / 2, 0.1);
    const distance = radius / Math.sin(THREE.MathUtils.degToRad(activeCamera.fov / 2)) * 1.2;
    activeCamera.position.copy(new THREE.Vector3(1, 0.62, 1).normalize().multiplyScalar(distance));
    activeCamera.near = Math.max(radius / 1000, 0.01);
    activeCamera.far = Math.max(distance * 30, 100);
    activeCamera.updateProjectionMatrix();
    fitDistanceRef.current = distance;
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.minDistance = Math.max(radius * 1.15, 0.12);
    controlsRef.current.maxDistance = distance * 2.4;
    controlsRef.current.update();
    if (process.env.NODE_ENV === "development") console.log("3D camera framing:", JSON.stringify({ position: activeCamera.position.toArray(), target: controlsRef.current.target.toArray(), fov: activeCamera.fov, near: activeCamera.near, far: activeCamera.far, distance }));
  }, [controlsRef, fitDistanceRef, size, viewport.width, viewport.height]);

  return null;
}

type ErrorBoundaryProps = { children: ReactNode; onError: (error: Error) => void };
type ErrorBoundaryState = { failed: boolean };

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type ViewPreset = "front" | "side" | "three-quarter";

export function ConfiguratorModel({
  modelPath,
  productName,
  configuration,
  initialDimensions,
}: {
  modelPath: string | null;
  productName: string;
  configuration: FurnitureConfiguration;
  initialDimensions: { width: number; depth: number; height: number };
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const fitDistanceRef = useRef(4);
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null);
  const [rendererReady, setRendererReady] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const handleBounds = useCallback((size: THREE.Vector3) => setModelSize(size), []);
  const handleError = useCallback((error: Error) => {
    console.error("3D model load/render error:", { productName, modelPath, error });
    setLoadError(error);
  }, [modelPath, productName]);
  const handleCanvasCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      setRendererReady(false);
      const error = new Error("WebGL context was lost while rendering the selected model.");
      console.error("3D model render error:", { productName, modelPath, error });
      setLoadError(error);
    });
    canvas.addEventListener("webglcontextrestored", () => {
      setLoadError(null);
      setRendererReady(true);
    });
    setRendererReady(true);
  }, [modelPath, productName]);
  const previewReady = rendererReady && modelSize !== null && loadError === null;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.log("Loading GLB:", modelPath);
  }, [modelPath]);

  const setView = (preset: ViewPreset) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const direction = preset === "front"
      ? new THREE.Vector3(0, 0.12, 1)
      : preset === "side"
        ? new THREE.Vector3(1, 0.12, 0)
        : new THREE.Vector3(1, 0.62, 1);
    controls.object.position.copy(controls.target).add(direction.normalize().multiplyScalar(fitDistanceRef.current));
    controls.update();
  };

  if (!modelPath) {
    return <div className="configurator-model-missing" role="status" data-model-state="missing">
      <strong>Exact 3D asset missing for {productName}.</strong>
      <div className="configurator-model-controls" aria-label="3D camera controls">
        <button type="button" disabled>Front</button>
        <button type="button" disabled>Side</button>
        <button type="button" disabled>3/4</button>
        <button type="button" disabled>Reset View</button>
      </div>
    </div>;
  }

  if (loadError) {
    return <div className="configurator-model-error" role="alert">
      <strong>3D MODEL ERROR</strong>
      <span>Model: {modelPath.split("/").pop()}</span>
      <span>Error: {loadError.message}</span>
    </div>;
  }

  return <div className="configurator-model-viewer" aria-label={`3D preview of ${productName}`} data-model-state={previewReady ? "loaded" : "loading"}>
    <Canvas fallback={<div className="configurator-webgl-fallback" role="alert">WebGL is unavailable; the exact 3D model cannot be rendered.</div>} onCreated={handleCanvasCreated} shadows="percentage" dpr={[1, 1.75]} camera={{ position: [4, 3, 5], fov: 36 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
      <color attach="background" args={["#e7e2da"]} />
      <ambientLight intensity={1.5} />
      <hemisphereLight intensity={0.7} color="#fffaf1" groundColor="#8b8175" />
      <directionalLight castShadow position={[5, 8, 5]} intensity={2} shadow-mapSize={[2048, 2048]} shadow-camera-far={30} />
      <directionalLight position={[-5, 4, -5]} intensity={1} color="#dce8ee" />
      <Environment preset="studio" />
      <Suspense fallback={<Html center><span className="viewer-loading">Loading 3D preview</span></Html>}>
        <ModelErrorBoundary onError={handleError}>
          <ConfigurableGLB key={modelPath} modelPath={modelPath} configuration={configuration} initialDimensions={initialDimensions} onBounds={handleBounds} onError={handleError} />
        </ModelErrorBoundary>
      </Suspense>
      <ContactShadows position={[0, -(modelSize?.y ?? 1) / 2, 0]} opacity={0.3} scale={6} blur={2.5} far={5} />
      <CameraFit size={modelSize} controlsRef={controlsRef} fitDistanceRef={fitDistanceRef} />
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} enablePan={false} minDistance={0.12} maxDistance={12} minPolarAngle={0.12} maxPolarAngle={Math.PI - 0.12} makeDefault />
    </Canvas>
    {!previewReady && <div className="configurator-canvas-fallback" role="status">Loading 3D Preview...</div>}
    <div className="configurator-model-controls" aria-label="3D camera controls">
      <button type="button" onClick={() => setView("front")}>Front</button>
      <button type="button" onClick={() => setView("side")}>Side</button>
      <button type="button" onClick={() => setView("three-quarter")}>3/4</button>
      <button type="button" onClick={() => setView("three-quarter")}>Reset View</button>
    </div>
  </div>;
}