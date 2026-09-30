"use client";

import type { FurnitureConfiguration, FurnitureProductSource } from "./FurnitureConfiguration";
import { FurnitureViewer } from "./FurnitureViewer";

export function Product360Viewer({ product, configuration }: { product: FurnitureProductSource; configuration: FurnitureConfiguration }) {

  return (
    <div className="product-360-stage">
      <div className="product-preview-layout">
        {product.image && (
          <div className="product-reference-image">
            <img
              className="product-selected-preview"
              src={product.image}
              alt={product.name}
              loading="eager"
            />

            <span className="product-reference-label">ORIGINAL PRODUCT</span>
          </div>
        )}

        <div className="product-interactive-preview"><FurnitureViewer product={product} configuration={configuration} /></div>
      </div>

      <div className="product-preview-actions">
        <span className="viewer-unavailable">Product-specific procedural 3D preview</span>
      </div>
    </div>
  );
}