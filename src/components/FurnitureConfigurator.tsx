"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogProduct } from "@/app/products/[id]/page";
import type { FurnitureConfiguration } from "./FurnitureConfiguration";
import { ConfiguratorModel } from "./3d/ConfiguratorModel";
import { getProductModelPath } from "@/lib/productModelMap";
import { PageFrame } from "./PatioShell";

type DimensionKey = "width" | "length" | "height";
type ConfiguratorValues = FurnitureConfiguration;

const styles = ["Modern", "Traditional", "Contemporary", "Minimal"];
const finishes = ["Natural", "Honey Oak", "Dark Walnut", "Matte Black", "Whitewash"];
const colors = ["Warm Neutral", "Forest Green", "Terracotta", "Charcoal", "Natural Wood"];
const baseMaterialAdjustments: Record<string, number> = { "Premium Wood": 0, "Natural Rattan": 4500, "Premium Upholstery": 8500, Teak: 12000, Walnut: 18000, "Weather-resistant Aluminium": 9500 };
const finishAdjustments: Record<string, number> = { Natural: 0, "Honey Oak": 2500, "Dark Walnut": 4500, "Matte Black": 1800, Whitewash: 2200 };
const colorAdjustments: Record<string, number> = { "Warm Neutral": 0, "Forest Green": 3200, Terracotta: 2200, Charcoal: 1800, "Natural Wood": 0 };
const upholsteryAdjustments: Record<string, number> = { Linen: 0, "Cotton Blend": 1200, "Performance Velvet": 3200, "Outdoor Canvas": 2400, Leather: 6500 };
const capacityAdjustments: Record<string, number> = { "2 Seater": 0, "3 Seater": 12000, "4 Seater": 18000, "5 Seater": 24000, "6 Seater": 26000, "8 Seater": 34000, Single: 0, Double: 6500, Queen: 12000, King: 18000, "2 Door": 0, "3 Door": 10000, "4 Door": 20000, "Single Unit": 0, "1 Seater": 0 };
const swatchColors: Record<string, string> = { "Warm Neutral": "#bcae9d", "Forest Green": "#315348", Terracotta: "#a85f43", Charcoal: "#3c4142", "Natural Wood": "#a2783e" };

function capacityOptionsFor(product: CatalogProduct) {
  const category = product.category.toLowerCase();
  if (/bedside|cupboard|console|dressing/.test(category)) return ["Single Unit"];
  if (/^beds?$/.test(category) || category.includes("divan")) return ["Single", "Double", "Queen", "King"];
  if (category.includes("l sofa")) return ["3 Seater", "4 Seater", "5 Seater"];
  if (category.includes("sofa")) return ["2 Seater", "3 Seater", "4 Seater"];
  if (category.includes("table")) return ["4 Seater", "6 Seater", "8 Seater"];
  if (/chair|ottoman|stool/.test(category)) return ["1 Seater"];
  return ["Single Unit"];
}

function materialOptionsFor(product: CatalogProduct, supportedMaterials: string[]) {
  if (supportedMaterials.length) return supportedMaterials;
  const category = product.category.toLowerCase();
  if (/sofa|chair|ottoman|stool|divan|bed/.test(category)) {
    return category.includes("chair")
      ? ["Premium Upholstery", "Premium Wood", "Natural Rattan", "Teak", "Walnut"]
      : ["Premium Upholstery", "Premium Wood", "Teak", "Walnut"];
  }
  const options = ["Premium Wood", "Teak", "Walnut"];
  if (/outdoor|garden|patio/.test(category)) options.push("Weather-resistant Aluminium", "Natural Rattan");
  return options;
}

function DetailOptions({ label, values, value, onChange }: { label: string; values: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="configurator-field">
    <div className="configurator-field-heading"><span>{label}</span></div>
    <div className="configurator-option-grid">
      {values.map((option) => <button className={value === option ? "selected" : ""} type="button" key={option} onClick={() => onChange(option)} aria-pressed={value === option}>{option}</button>)}
    </div>
  </div>;
}

function DimensionControls({ product, configuration, onChange }: { product: CatalogProduct; configuration: ConfiguratorValues; onChange: (key: DimensionKey, value: number) => void }) {
  const limits: Record<DimensionKey, [number, number]> = {
    width: [Math.max(35, product.dimensions.width - 60), product.dimensions.width + 100],
    length: [Math.max(30, product.dimensions.depth - 40), product.dimensions.depth + 80],
    height: [Math.max(35, product.dimensions.height - 60), product.dimensions.height + 100],
  };

  return <section className="configurator-panel">
    <small>01 / DIMENSIONS</small>
    <h2>Make it fit your room.</h2>
    {(["width", "length", "height"] as const).map((key) => {
      const [min, max] = limits[key];
      const label = key[0].toUpperCase() + key.slice(1);
      return <label className="configurator-dimension" key={key}>
        <span>{label}<output>{configuration[key]} cm</output></span>
        <input aria-label={`${label} slider`} type="range" min={min} max={max} value={configuration[key]} onChange={(event) => onChange(key, Number(event.target.value))} />
        <input aria-label={`${label} in centimetres`} className="configurator-number" type="number" min={min} max={max} value={configuration[key]} onChange={(event) => onChange(key, Math.min(max, Math.max(min, Number(event.target.value) || min)))} />
      </label>;
    })}
  </section>;
}

function ColorSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="configurator-field">
    <div className="configurator-field-heading"><span>Color</span></div>
    <div className="configurator-color-options">
      {colors.map((color) => <button className={value === color ? "selected" : ""} type="button" key={color} onClick={() => onChange(color)} aria-pressed={value === color}><i style={{ backgroundColor: swatchColors[color] }} />{color}</button>)}
    </div>
  </div>;
}

function ProductImage({ product }: { product: CatalogProduct }) {
  return <figure className="configurator-original">
    <img src={product.image} alt={product.name} />
    <figcaption>Original product</figcaption>
  </figure>;
}

function ConfiguratorSummary({ product, configuration, price, onNotesChange, onRequestQuote }: { product: CatalogProduct; configuration: ConfiguratorValues; price: number; onNotesChange: (notes: string) => void; onRequestQuote: () => void }) {
  return <section className="configurator-summary">
    <div><small>YOUR CONFIGURATION</small><h2>{product.name}</h2></div>
    <div className="configurator-summary-grid">
      <p><span>Product ID</span><b>{configuration.productId}</b></p>
      <p><span>Category</span><b>{configuration.category}</b></p>
      <p><span>Dimensions</span><b>{configuration.width} × {configuration.length} × {configuration.height} cm</b></p>
      <p><span>Style</span><b>{configuration.style}</b></p>
      <p><span>Material</span><b>{configuration.material}</b></p>
      {product.fabrics.length > 0 && <p><span>Upholstery</span><b>{configuration.upholstery}</b></p>}
      <p><span>Finish</span><b>{configuration.finish}</b></p>
      <p><span>Capacity</span><b>{configuration.capacity}</b></p>
      <p><span>Color</span><b>{configuration.color}</b></p>
      <p className="configurator-estimate"><span>Estimated price</span><b>LKR {price.toLocaleString("en-LK")}</b></p>
    </div>
    <label className="configurator-notes">Project notes<textarea value={configuration.notes} onChange={(event) => onNotesChange(event.target.value)} placeholder="Anything else we should know?" /></label>
    <button className="configurator-quote-button" type="button" onClick={onRequestQuote}>Request a Quote <span aria-hidden="true">→</span></button>
  </section>;
}

export function FurnitureConfigurator({ product }: { product: CatalogProduct }) {
  const modelPath = getProductModelPath(product.id, product.category);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    console.log("3D product:", product);
    console.log("3D category:", product.category);
    console.log("3D model path:", modelPath);
  }, [modelPath, product]);
  const capacities = capacityOptionsFor(product);
  const materials = materialOptionsFor(product, []);
  const initialValues: ConfiguratorValues = {
    productId: product.id,
    category: product.category,
    width: product.dimensions.width,
    length: product.dimensions.depth,
    height: product.dimensions.height,
    style: "Modern",
    material: materials.includes("Premium Upholstery") ? "Premium Upholstery" : materials[0] ?? "Premium Wood",
    finish: "Natural",
    upholstery: product.fabrics[0] ?? "",
    capacity: capacities[0] ?? "Single Unit",
    color: "Warm Neutral",
    notes: "",
  };
  const [configuration, setConfiguration] = useState(initialValues);
  const values = configuration;
  const update = <Key extends keyof ConfiguratorValues>(key: Key, value: ConfiguratorValues[Key]) => setConfiguration((current) => ({ ...current, [key]: value }));
  const dimensionsDelta = Math.max(0, Math.round(((values.width - product.dimensions.width) + (values.length - product.dimensions.depth) + (values.height - product.dimensions.height)) / 10) * 450);
  const price = product.price + dimensionsDelta + (baseMaterialAdjustments[values.material] ?? 0) + (finishAdjustments[values.finish] ?? 0) + (colorAdjustments[values.color] ?? 0) + (upholsteryAdjustments[values.upholstery] ?? 0) + (capacityAdjustments[values.capacity] ?? 0);

  const requestQuote = () => {
    const message = [
      "Patio King quote request",
      "I would like to inquire about:",
      `Product: ${product.name}`,
      `Category: ${configuration.category}`,
      `Dimensions: W ${configuration.width}cm × L ${configuration.length}cm × H ${configuration.height}cm`,
      `Style: ${configuration.style}`,
      `Material: ${configuration.material}`,
      `Finish: ${configuration.finish}`,
      `Capacity: ${configuration.capacity}`,
      `Color: ${configuration.color}`,
      `Estimated price: LKR ${price.toLocaleString("en-LK")}`,
      `Project notes: ${configuration.notes || "None"}`,
    ].join("\n");
    window.open(`https://wa.me/94773424994?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <PageFrame>
    <section className="furniture-configurator">
      <header className="configurator-heading">
        <Link className="configurator-back" href={`/shop/${product.id}`}>← Back to {product.name}</Link>
        <Link className="configurator-change-piece" href="/customize">Choose another piece</Link>
        <small>MADE FOR YOUR SPACE / {product.category.toUpperCase()}</small>
        <h1>Make it <em>yours.</em></h1>
        <p>{product.name}</p>
      </header>
      <div className="furniture-configurator-layout">
        <div className="configurator-controls">
          <DimensionControls product={product} configuration={configuration} onChange={(key, value) => update(key, value)} />
          <section className="configurator-panel configurator-details">
            <small>02 / DETAILS</small>
            <h2>Make it yours.</h2>
            <DetailOptions label="Style" values={styles} value={values.style} onChange={(value) => update("style", value)} />
            <DetailOptions label="Material" values={materials} value={values.material} onChange={(value) => update("material", value)} />
            {product.fabrics.length > 0 && <DetailOptions label="Upholstery" values={product.fabrics} value={values.upholstery} onChange={(value) => update("upholstery", value)} />}
            <DetailOptions label="Finish" values={finishes} value={values.finish} onChange={(value) => update("finish", value)} />
            <DetailOptions label="Capacity" values={capacities} value={values.capacity} onChange={(value) => update("capacity", value)} />
            <ColorSelector value={values.color} onChange={(value) => update("color", value)} />
          </section>
        </div>
        <aside className="configurator-preview-column">
          <section className="configurator-preview" aria-label="Product preview">
            <div className="configurator-preview-label"><span>INTERACTIVE 3D PREVIEW</span><span>{product.name.toUpperCase()}</span></div>
            <ConfiguratorModel modelPath={modelPath} productName={product.name} configuration={configuration} initialDimensions={product.dimensions} />
            <ProductImage product={product} />
          </section>
          <p className="configurator-preview-note configurator-capability-note">Product-specific 3D form. The selected product image remains the visual reference.</p>
        </aside>
      </div>
      <ConfiguratorSummary product={product} configuration={configuration} price={price} onNotesChange={(notes) => update("notes", notes)} onRequestQuote={requestQuote} />
    </section>
  </PageFrame>;
}