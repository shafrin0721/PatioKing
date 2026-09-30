"use client";

import { useState } from "react";
import Link from "next/link";
import { Product360Viewer } from "./Product360Viewer";
import { PageFrame } from "./PatioShell";
import type { CatalogCategory, CatalogProduct } from "@/app/products/[id]/page";
import type { FurnitureConfiguration } from "./FurnitureConfiguration";

type Props = { selectedProduct?: CatalogProduct; products: CatalogProduct[]; categories: CatalogCategory[]; selectedCategory?: string };

const styles = ["Modern", "Traditional", "Contemporary", "Minimal"];
const materials = ["Premium Wood", "Natural Rattan", "Premium Upholstery", "Teak", "Walnut", "Weather-resistant Aluminium"];
const finishes = ["Natural", "Honey Oak", "Dark Walnut", "Matte Black", "Whitewash"];
const upholsteryOptions = ["Linen", "Cotton Blend", "Performance Velvet", "Outdoor Canvas", "Leather"];
const colors = ["Warm Neutral", "Forest Green", "Terracotta", "Charcoal", "Natural Wood"];
const defaultDimensions: [number, number, number] = [120, 80, 80];
const baseAdjustments: Record<string, number> = { "Premium Wood": 0, "Natural Rattan": 4500, "Premium Upholstery": 8500, Teak: 12000, Walnut: 18000, "Weather-resistant Aluminium": 9500 };
const finishAdjustments: Record<string, number> = { Natural: 0, "Honey Oak": 2500, "Dark Walnut": 4500, "Matte Black": 1800, Whitewash: 2200 };
const fabricAdjustments: Record<string, number> = { Linen: 0, "Cotton Blend": 1200, "Performance Velvet": 3200, "Outdoor Canvas": 2400, Leather: 6500 };

function dimensionsFor(product?: CatalogProduct): [number, number, number] {
  return product ? [product.dimensions.width, product.dimensions.depth, product.dimensions.height] : defaultDimensions;
}

function supportsUpholstery(category: string) {
  return /chair|sofa|ottoman|stool|divan|bed/i.test(category);
}

function capacitiesFor(category: string) {
  const value = category.toLowerCase();
  if (/bedside|cupboard|console|dressing|dresser/.test(value)) return ["Single Unit"];
  if (/^beds?$/.test(value) || value.includes("divan")) return ["Single", "Double", "Queen", "King"];
  if (value.includes("l sofa")) return ["3 Seater", "4 Seater", "5 Seater"];
  if (value.includes("sofa")) return ["2 Seater", "3 Seater", "4 Seater"];
  if (value.includes("table")) return ["4 Seater", "6 Seater", "8 Seater"];
  if (/chair|ottoman|stool/.test(value)) return ["1 Seater"];
  return ["Single Unit"];
}

function initialConfiguration(product?: CatalogProduct): FurnitureConfiguration {
  const [width, length, height] = dimensionsFor(product);
  const usesUpholstery = supportsUpholstery(product?.category ?? "");
  return {
    productId: product?.id ?? "",
    category: product?.category ?? "",
    width,
    length,
    height,
    style: "Modern",
    material: usesUpholstery ? "Premium Upholstery" : "Premium Wood",
    finish: "Natural",
    upholstery: product?.fabrics[0] ?? (usesUpholstery ? "Linen" : ""),
    capacity: product ? capacitiesFor(product.category)[0] ?? "Single Unit" : "Single Unit",
    color: "Warm Neutral",
    notes: "",
  };
}

export function CustomizeExperience({ selectedProduct, products, categories, selectedCategory }: Props) {
  const [product, setProduct] = useState(selectedProduct);
  const [choosing, setChoosing] = useState(!selectedProduct);
  const [config, setConfig] = useState(() => initialConfiguration(selectedProduct));
  const [submitted, setSubmitted] = useState(false);
  const update = <Key extends keyof FurnitureConfiguration>(key: Key, value: FurnitureConfiguration[Key]) => setConfig((current) => ({ ...current, [key]: value }));
  const chooseProduct = (next: CatalogProduct) => {
    setProduct(next);
    setConfig(initialConfiguration(next));
    setChoosing(false);
    setSubmitted(false);
  };
  const dimensions = dimensionsFor(product);
  const capacityOptions = capacitiesFor(product?.category ?? "");
  const upholsteryEnabled = supportsUpholstery(product?.category ?? "");
  const price = product ? (() => {
    const dimensionChange = Math.max(0, Math.round(((config.width - dimensions[0]) + (config.length - dimensions[1]) + (config.height - dimensions[2])) / 10) * 450);
    const capacityAdjustments: Record<string, number> = { "2 Seater": 0, "3 Seater": 12000, "4 Seater": 18000, "5 Seater": 24000, "6 Seater": 26000, "8 Seater": 34000, Single: 0, Double: 6500, Queen: 12000, King: 18000, "2 Door": 0, "3 Door": 10000, "4 Door": 20000, "Single Unit": 0, "1 Seater": 0 };
    const colorAdjustments: Record<string, number> = { "Warm Neutral": 0, "Forest Green": 3200, Terracotta: 2200, Charcoal: 1800, "Natural Wood": 0 };
    return product.price + dimensionChange + (baseAdjustments[config.material] ?? 0) + (finishAdjustments[config.finish] ?? 0) + (upholsteryEnabled ? fabricAdjustments[config.upholstery] ?? 0 : 0) + (colorAdjustments[config.color] ?? 0) + (capacityAdjustments[config.capacity] ?? 0);
  })() : 0;

  const requestQuote = () => {
    if (!product) return;
    const message = [
      "Patio King quote request",
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      `Product ID: ${product.id}`,
      `Dimensions: ${config.width} x ${config.length} x ${config.height} cm`,
      `Style: ${config.style}`,
      `Material: ${config.material}`,
      `Finish: ${config.finish}`,
      `Upholstery: ${config.upholstery || "Not applicable"}`,
      `Capacity: ${config.capacity}`,
      `Color: ${config.color}`,
      `Estimated price: LKR ${price.toLocaleString("en-LK")}`,
      `Project notes: ${config.notes || "None"}`,
    ].join("\n");
    setSubmitted(true);
    window.open(`https://wa.me/94773424994?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  if (!product) {
    return <PageFrame>
      <section className="customizer-page customizer-empty">
        <small>{selectedCategory ? "CHOOSE A PRODUCT" : "MADE FOR YOUR SPACE"}</small>
        <h1>Customize Your<br /><em>Furniture.</em></h1>
        <p>{selectedCategory ? "Select a product from this category to begin customizing." : "Create a piece that fits your space."}</p>
        {selectedCategory ? <>
          <h2>Choose your {categories.find((item) => item.id === selectedCategory)?.name ?? "piece"}</h2>
          <div className="customizer-grid type-grid">
            {products.map((item) => <Link className="customizer-choice" href={`/customize?category=${encodeURIComponent(selectedCategory)}&productId=${encodeURIComponent(item.id)}`} key={item.id}><img src={item.image} alt={item.name} loading="lazy" /><span>{item.name}</span></Link>)}
          </div>
          <Link className="customizer-consultation-link" href="/customize">Change category</Link>
        </> : <>
          <h2>Choose a category</h2>
          <div className="customizer-grid type-grid">
            {categories.map((item) => <Link className="customizer-choice" href={`/customize?category=${encodeURIComponent(item.id)}`} key={item.id}><img src={item.image} alt="" loading="lazy" /><span>{item.name}</span></Link>)}
          </div>
        </>}
      </section>
    </PageFrame>;
  }

  return <PageFrame>
    <section className="customizer-page">
      <div className="customizer-intro">
        <small>MADE FOR YOUR SPACE</small>
        <h1>Customize your<br /><em>furniture.</em></h1>
        <h2>{product.name}</h2>
        <p>Configure this piece to suit your space.</p>
        <button className="customizer-consultation-link" type="button" onClick={() => setChoosing(true)}>Change piece</button>
      </div>
      {choosing && <div className="customizer-picker">
        <h2>Choose another piece</h2>
        <div className="customizer-grid type-grid">{products.map((item) => <button type="button" key={item.id} onClick={() => chooseProduct(item)}>{item.name}</button>)}</div>
      </div>}
      <div className="customizer-layout">
        <div className="customizer-form">
          <section className="customizer-block">
            <small>01 - SHAPE AND SIZE</small>
            <h2>Make it fit your room.</h2>
            {(["width", "length", "height"] as const).map((key, index) => {
              const label = key[0].toUpperCase() + key.slice(1);
              const minimum = Math.max(30, dimensions[index] - 32);
              const maximum = dimensions[index] + 80;
              return <label className="dimension-control" key={key}>
                <span>{label}<output>{config[key]} cm</output></span>
                <input type="range" min={minimum} max={maximum} value={config[key]} onChange={(event) => update(key, Number(event.target.value))} />
                <input className="dimension-input" type="number" min={minimum} max={maximum} value={config[key]} onChange={(event) => update(key, Math.min(maximum, Math.max(minimum, Number(event.target.value) || minimum)))} />
              </label>;
            })}
          </section>
          <section className="customizer-block">
            <small>02 - DETAILS</small>
            <h2>Make it yours.</h2>
            <div className="selection-heading"><span>Style</span><small>Live 3D preview</small></div>
            <div className="customizer-grid option-grid">{styles.map((item) => <button type="button" className={config.style === item ? "selected" : ""} onClick={() => update("style", item)} key={item}>{item}</button>)}</div>
            <div className="selection-heading"><span>Material</span><small>Live 3D preview</small></div>
            <div className="customizer-grid option-grid">{materials.map((item) => <button type="button" className={config.material === item ? "selected" : ""} onClick={() => update("material", item)} key={item}>{item}</button>)}</div>
            <div className="selection-heading"><span>Finish</span></div>
            <div className="customizer-grid option-grid">{finishes.map((item) => <button type="button" className={config.finish === item ? "selected" : ""} onClick={() => update("finish", item)} key={item}>{item}</button>)}</div>
            {upholsteryEnabled && <>
              <div className="selection-heading"><span>Upholstery</span></div>
              <div className="customizer-grid option-grid">{(product.fabrics.length ? product.fabrics : upholsteryOptions).map((item) => <button type="button" className={config.upholstery === item ? "selected" : ""} onClick={() => update("upholstery", item)} key={item}>{item}</button>)}</div>
            </>}
            <div className="selection-heading"><span>Capacity</span></div>
            <div className="customizer-grid option-grid">{capacityOptions.map((item) => <button type="button" className={config.capacity === item ? "selected" : ""} onClick={() => update("capacity", item)} key={item}>{item}</button>)}</div>
            <div className="selection-heading"><span>Color</span></div>
            <div className="customizer-grid option-grid">{colors.map((item) => <button type="button" className={config.color === item ? "selected" : ""} onClick={() => update("color", item)} key={item}>{item}</button>)}</div>
            <label className="notes-field">Project notes<textarea value={config.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Tell us about your space and timeline..." /></label>
          </section>
        </div>
        <aside className="customizer-preview">
          <div className="preview-3d">
            <div className="preview-kicker"><span>SELECTED PRODUCT</span><span>LIVE 3D MODEL</span></div>
            <Product360Viewer product={product} configuration={config} />
          </div>
          <section className="configuration-summary">
            <small>YOUR PIECE</small>
            <h2>{product.name}</h2>
            {[ ["Product ID", product.id], ["Category", product.category], ["Size", `${config.width} x ${config.length} x ${config.height} cm`], ["Style", config.style], ["Material", config.material], ["Finish", config.finish], ["Upholstery", config.upholstery || "Not applicable"], ["Capacity", config.capacity], ["Color", config.color] ].map(([label, value]) => <p key={label}><span>{label}</span><b>{value}</b></p>)}
            <p className="summary-price"><span>Estimated price</span><b>LKR {price.toLocaleString("en-LK")}</b></p>
            <button className="dark-button" type="button" onClick={requestQuote}>Request a Quote <span>-&gt;</span></button>
            {submitted && <small>Configuration ready for your conversation.</small>}
          </section>
        </aside>
      </div>
    </section>
  </PageFrame>;
}