"use client";

import { useSearchParams } from "next/navigation";
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

export function Product360Viewer({
  furnitureType,
  material,
  finish,
  upholstery = "Linen",
  color,
  width = 72,
  length = 78,
  height = 86,
  productImage,
}: Product360ViewerProps) {
  const searchParams = useSearchParams();

  const selectedImage =
    productImage ?? searchParams.get("image") ?? undefined;

  const model = getFurnitureModel(furnitureType);

  return (
    <div className="product-360-stage">
      <div className="product-preview-layout">
        {selectedImage && (
          <div className="product-reference-image">
            <img
              className="product-selected-preview"
              src={selectedImage}
              alt={`${furnitureType} selected product`}
              loading="eager"
            />

            <span className="product-reference-label">
              SELECTED PRODUCT
            </span>
          </div>
        )}

        <div className="product-interactive-preview">
          <Furniture3DViewer
            furnitureType={furnitureType}
            material={material}
            finish={finish}
            upholstery={upholstery}
            color={color}
            width={width}
            length={length}
            height={height}
          />
        </div>
      </div>

      <div className="product-preview-actions">
        <span className="viewer-unavailable">
          {model.kind === "gltf"
            ? "Interactive 3D product model"
            : "Interactive furniture preview"}
        </span>
      </div>
    </div>
  );
}