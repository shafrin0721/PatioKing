"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { React360Viewer } from "@paulin_bixlers/react-360-product-viewer";
import { StyleSheetManager } from "styled-components";
import { getFurniture360Asset } from "./furniture360Assets";
import { Furniture3DViewer } from "./Furniture3DViewer";
import { getFurnitureModel } from "./furnitureModels";

type Product360ViewerProps = {
  furnitureType: string;
  material: string;
  finish: string;
  upholstery?: string;
  color: string;
  width?: number;
  length?: number;
  height?: number;
  productImage?: string;
};

export function Product360Viewer({ furnitureType, material, finish, upholstery = "Linen", color, width = 72, length = 78, height = 86, productImage }: Product360ViewerProps) {
  const searchParams = useSearchParams();
  const selectedImage = productImage ?? searchParams.get("image") ?? undefined;
  const [imageFallback, setImageFallback] = useState(false);
  const model = getFurnitureModel(furnitureType);

  if (!imageFallback) {
    return <div className="product-360-stage">{selectedImage ? <img className="product-selected-preview" src={selectedImage} alt={`${furnitureType} selected product preview`} loading="eager" /> : <Furniture3DViewer furnitureType={furnitureType} material={material} finish={finish} upholstery={upholstery} color={color} width={width} length={length} height={height} />}<div className="product-preview-actions">{selectedImage && <a className="viewer-fallback-toggle" href={selectedImage} download>Download preview image</a>}{selectedImage ? <span className="viewer-unavailable">Selected JPG preview - no product-specific 360 frames supplied</span> : <button className="viewer-fallback-toggle" type="button" onClick={() => setImageFallback(true)}>View available 360 frames</button>}</div>{model.kind !== "gltf" && <span className="viewer-model-note">Selected product preview</span>}</div>;
  }

  return <Image360Fallback furnitureType={furnitureType} material={material} finish={finish} color={color} onBack={() => setImageFallback(false)} />;
}

function Image360Fallback({ furnitureType, material, finish, color, onBack }: Pick<Product360ViewerProps, "furnitureType" | "material" | "finish" | "color"> & { onBack: () => void }) {
  const asset = getFurniture360Asset(furnitureType);
  return <div className="product-360-viewer" aria-label={`${furnitureType} 360 degree product preview`}><StyleSheetManager shouldForwardProp={(prop) => prop !== "isGrabbing"}><React360Viewer imagesBaseUrl={asset.baseUrl} imagesCount={8} imagesFiletype="jpg" imageFilenamePrefix={asset.filenamePrefix} zeroPad={1} imageInitialIndex={0} mouseDragSpeed={18} autoplay autoplaySpeed={24} width={420} height={300} showRotationIconOnStartup /></StyleSheetManager><span className="product-360-state">{material} / {finish} / {color}</span><span className="product-360-hint">Drag to rotate</span><button className="viewer-fallback-toggle" type="button" onClick={onBack}>Back to preview</button></div>;
}