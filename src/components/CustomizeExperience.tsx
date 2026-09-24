"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product360Viewer } from "./Product360Viewer";
import { PageFrame } from "./PatioShell";
import type { CatalogCategory, CatalogProduct } from "@/app/products/[id]/page";

type Configuration = { productId: string; furnitureType: string; width: number; length: number; height: number; style: string; material: string; finish: string; upholstery: string; capacity: string; color: string; notes: string };
type Props = { selectedProduct?: CatalogProduct; products: CatalogProduct[]; categories: CatalogCategory[]; selectedCategory?: string };

const styles = ["Modern", "Traditional", "Contemporary", "Minimal"];
const materials = ["Premium Wood", "Natural Rattan", "Premium Upholstery", "Teak", "Walnut", "Weather-resistant Aluminium"];
const finishes = ["Natural", "Honey Oak", "Dark Walnut", "Matte Black", "Whitewash"];
const upholstery = ["Linen", "Cotton Blend", "Performance Velvet", "Outdoor Canvas", "Leather"];
const colors = ["Warm Neutral", "Forest Green", "Terracotta", "Charcoal", "Natural Wood"];
const profiles = { chair: [72, 78, 86], sofa: [220, 95, 82], table: [160, 90, 75], cabinet: [100, 50, 85], default: [120, 80, 80] } as const;
const baseAdjustments = { "Premium Wood": 0, "Natural Rattan": 4500, "Premium Upholstery": 8500, Teak: 12000, Walnut: 18000, "Weather-resistant Aluminium": 9500 };
const finishAdjustments = { Natural: 0, "Honey Oak": 2500, "Dark Walnut": 4500, "Matte Black": 1800, Whitewash: 2200 };
const upholsteryAdjustments = { Linen: 0, "Cotton Blend": 1200, "Performance Velvet": 3200, "Outdoor Canvas": 2400, Leather: 6500 };

function kindFor(category: string) { const value = category.toLowerCase(); if (value.includes("sofa")) return "sofa"; if (value.includes("table")) return "table"; if (/cupboard|console|dressing/.test(value)) return "cabinet"; if (/chair|ottoman|stool/.test(value)) return "chair"; return "default"; }
function profileFor(category: string) { return profiles[kindFor(category)]; }
function supportsUpholstery(category: string) { return /chair|sofa|ottoman|stool|divan/i.test(category); }
function capacitiesFor(category: string) { const value = category.toLowerCase(); if (value.includes("sofa")) return ["2 Seater", "3 Seater", "4 Seater"]; if (value.includes("table")) return ["4 Seater", "6 Seater"]; return ["1 Seater"]; }
function materialsFor(category: string) { const value = category.toLowerCase(); if (value.includes("sofa")) return ["Premium Upholstery", "Premium Wood", "Teak", "Walnut"]; if (value.includes("dining table")) return ["Premium Wood", "Teak", "Walnut"]; if (value.includes("bar stool")) return ["Premium Wood", "Natural Rattan", "Teak", "Walnut", "Weather-resistant Aluminium"]; return materials; }
function finishesFor(category: string) { return category.toLowerCase().includes("sofa") ? [] : finishes; }

function initialConfiguration(product?: CatalogProduct): Configuration {
  const [width, length, height] = product ? profileFor(product.category) : profiles.default;
  const capacity = product ? capacitiesFor(product.category)[0] : "1 Seater";
  return { productId: product?.id ?? "", furnitureType: product?.category ?? "", width, length, height, style: "Modern", material: supportsUpholstery(product?.category ?? "") ? "Premium Upholstery" : "Premium Wood", finish: "Natural", upholstery: supportsUpholstery(product?.category ?? "") ? "Linen" : "", capacity, color: "Warm Neutral", notes: "" };
}

export function CustomizeExperience({ selectedProduct, products, categories, selectedCategory }: Props) {
  const [product, setProduct] = useState(selectedProduct);
  const [choosing, setChoosing] = useState(!selectedProduct);
  const [config, setConfig] = useState(() => initialConfiguration(selectedProduct));
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    setProduct(selectedProduct);
    setConfig(initialConfiguration(selectedProduct));
    setChoosing(!selectedProduct);
    setSubmitted(false);
  }, [selectedProduct?.id]);
  const update = <Key extends keyof Configuration>(key: Key, value: Configuration[Key]) => setConfig((current) => ({ ...current, [key]: value }));
  const chooseProduct = (next: CatalogProduct) => { setProduct(next); setConfig(initialConfiguration(next)); setChoosing(false); setSubmitted(false); };
  const range = profileFor(product?.category ?? "");
  const capacityOptions = capacitiesFor(product?.category ?? "");
  const upholsteryEnabled = supportsUpholstery(product?.category ?? "");
  const price = product ? (() => {
    const dimensions = Math.max(0, Math.round(((config.width - range[0]) + (config.length - range[1]) + (config.height - range[2])) / 10) * 450);
    return product.price + dimensions + (baseAdjustments[config.material as keyof typeof baseAdjustments] ?? 0) + (finishAdjustments[config.finish as keyof typeof finishAdjustments] ?? 0) + (upholsteryEnabled ? upholsteryAdjustments[config.upholstery as keyof typeof upholsteryAdjustments] ?? 0 : 0) + (config.capacity === "6 Seater" ? 18000 : config.capacity === "4 Seater" ? 9000 : config.capacity === "3 Seater" ? 12000 : 0);
  })() : 0;
  const requestQuote = () => { if (!product) return; const message = [`Patio King quote request`, `Product: ${product.name}`, `Category: ${product.category}`, `Product ID: ${product.id}`, `Dimensions: ${config.width} x ${config.length} x ${config.height} cm`, `Style: ${config.style}`, `Material: ${config.material}`, `Finish: ${config.finish}`, `Upholstery: ${config.upholstery || "Not applicable"}`, `Capacity: ${config.capacity}`, `Color: ${config.color}`, `Estimated price: LKR ${price.toLocaleString("en-LK")}`, `Project notes: ${config.notes || "None"}`].join("\n"); setSubmitted(true); window.open(`https://wa.me/94773424994?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); };

  if (!product) return <PageFrame><section className="customizer-page customizer-empty"><small>{selectedCategory ? "CHOOSE A PRODUCT" : "MADE FOR YOUR SPACE"}</small><h1>Customize Your<br /><em>Furniture.</em></h1><p>{selectedCategory ? "Select a product from this category to begin customizing." : "Create a piece that fits your space."}</p>{selectedCategory ? <><h2>Choose your {categories.find((item) => item.id === selectedCategory)?.name ?? "piece"}</h2><div className="customizer-grid type-grid">{products.map((item) => <Link className="customizer-choice" href={`/customize?category=${encodeURIComponent(selectedCategory)}&productId=${item.id}`} key={item.id}><img src={item.image} alt={item.name} loading="lazy" /><span>{item.name}</span></Link>)}</div><Link className="customizer-consultation-link" href="/customize">Change category</Link></> : <><h2>Choose a category</h2><div className="customizer-grid type-grid">{categories.map((item) => <Link className="customizer-choice" href={`/customize?category=${item.id}`} key={item.id}><img src={item.image} alt="" loading="lazy" /><span>{item.name}</span></Link>)}</div></>}</section></PageFrame>;

  return <PageFrame><section className="customizer-page"><div className="customizer-intro"><small>MADE FOR YOUR SPACE</small><h1>Customize your<br /><em>furniture.</em></h1><h2>{product.name}</h2><p>Configure this piece to suit your space.</p><button className="customizer-consultation-link" type="button" onClick={() => setChoosing(true)}>Change piece</button></div>{choosing && <div className="customizer-picker"><h2>Choose another piece</h2><div className="customizer-grid type-grid">{products.map((item) => <button type="button" key={item.id} onClick={() => chooseProduct(item)}>{item.name}</button>)}</div></div>}<div className="customizer-layout"><div className="customizer-form"><section className="customizer-block"><small>01 - SHAPE AND SIZE</small><h2>Make it fit your room.</h2>{([["Width", "width", range[0] - 32, range[0] + 80, config.width], ["Length", "length", range[1] - 32, range[1] + 80, config.length], ["Height", "height", range[2] - 32, range[2] + 80, config.height]] as const).map(([label, key, min, max, value]) => <label className="dimension-control" key={key}><span>{label}<output>{value} cm</output></span><input type="range" min={min} max={max} value={value} onChange={(event) => update(key, Number(event.target.value))} /><input className="dimension-input" type="number" min={min} max={max} value={value} onChange={(event) => update(key, Number(event.target.value))} /></label>)}</section><section className="customizer-block"><small>02 - DETAILS</small><h2>Make it yours.</h2><div className="selection-heading"><span>Style</span><small>Stored with your quote</small></div><div className="customizer-grid option-grid">{styles.map((item) => <button type="button" className={config.style === item ? "selected" : ""} onClick={() => update("style", item)} key={item}>{item}</button>)}</div><div className="selection-heading"><span>Material</span><small>Preview changes only when an asset variant exists</small></div><div className="customizer-grid option-grid">{materials.map((item) => <button type="button" className={config.material === item ? "selected" : ""} onClick={() => update("material", item)} key={item}>{item}</button>)}</div><div className="selection-heading"><span>Finish</span></div><div className="customizer-grid option-grid">{finishes.map((item) => <button type="button" className={config.finish === item ? "selected" : ""} onClick={() => update("finish", item)} key={item}>{item}</button>)}</div>{upholsteryEnabled && <><div className="selection-heading"><span>Upholstery</span></div><div className="customizer-grid option-grid">{upholstery.map((item) => <button type="button" className={config.upholstery === item ? "selected" : ""} onClick={() => update("upholstery", item)} key={item}>{item}</button>)}</div></>}<div className="selection-heading"><span>Capacity</span></div><div className="customizer-grid option-grid">{capacityOptions.map((item) => <button type="button" className={config.capacity === item ? "selected" : ""} onClick={() => update("capacity", item)} key={item}>{item}</button>)}</div><div className="selection-heading"><span>Color</span></div><div className="customizer-grid option-grid">{colors.map((item) => <button type="button" className={config.color === item ? "selected" : ""} onClick={() => update("color", item)} key={item}>{item}</button>)}</div><label className="notes-field">Project notes<textarea value={config.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Tell us about your space and timeline..." /></label></section></div><aside className="customizer-preview"><div className="preview-3d"><div className="preview-kicker"><span>SELECTED PRODUCT</span><span>JPG PREVIEW</span></div><Product360Viewer furnitureType={product.category} material={config.material} finish={config.finish} upholstery={config.upholstery} color={config.color} productImage={product.image} /></div><section className="configuration-summary"><small>YOUR PIECE</small><h2>{product.name}</h2>{[["Size", `${config.width} x ${config.length} x ${config.height} cm`], ["Style", config.style], ["Material", config.material], ["Finish", config.finish], ["Upholstery", config.upholstery || "Not applicable"], ["Capacity", config.capacity], ["Color", config.color]].map(([label, value]) => <p key={label}><span>{label}</span><b>{value}</b></p>)}<p className="summary-price"><span>Estimated price</span><b>LKR {price.toLocaleString("en-LK")}</b></p><button className="dark-button" type="button" onClick={requestQuote}>Request a Quote <span>-&gt;</span></button>{submitted && <small>Configuration ready for your conversation.</small>}</section></aside></div></section></PageFrame>;
}