import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { PageFrame } from "@/components/PatioShell";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductShare } from "@/components/ProductShare";

export type CatalogProduct = { id: string; name: string; category: string; price: number; image: string; gallery: string[] };
export type CatalogCategory = { id: string; name: string; category: string; image: string };
const assetsDirectory = path.join(process.cwd(), "public", "assets");
const categoryPrices: Record<string, number> = { cupboard: 45000, "dining-chair": 18000, "dining-table": 65000, divan: 85000, "dressing-table": 55000, "pouf-ottoman": 22000, "relaxing-chair": 42000, "rocking-chair": 48000, "round-sofa": 125000, "single-chair": 32000, sofa: 110000, "tv-console": 58000 };
function slug(value: string) { return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function singularizeCategoryKey(value: string) {
  return value
    .replace(/chairs$/i, "chair")
    .replace(/tables$/i, "table")
    .replace(/cupboards$/i, "cupboard")
    .replace(/sofas$/i, "sofa")
    .replace(/consoles$/i, "console")
    .replace(/ottomans$/i, "ottoman")
    .replace(/stools$/i, "stool")
    .replace(/s$/i, "");
}
export function canonicalCategoryId(value: string) { const id = singularizeCategoryKey(slug(value)); return id === "sofas" ? "sofa" : id === "tables" ? "dining-table" : id; }
function label(value: string) {
  const withSpaces = value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ");
  const normalized = withSpaces.replace(/\b(Chairs|Tables|Cupboards|Sofas|Consoles|Ottomans|Stools)\b$/i, (match) => match.slice(0, -1));
  return normalized.replace(/\b\w/g, (character) => character.toUpperCase());
}
function productDisplayName(category: string, index: number) {
  const base = category.replace(/s$/i, "");
  const descriptors = ["Classic", "Studio", "Aurora", "Luna", "Harbor", "Nova", "Cedar", "Milo", "Ridge", "Ember", "Solace", "Verde"];
  const descriptor = descriptors[index % descriptors.length] ?? "Classic";
  const suffix = index >= descriptors.length ? ` ${index + 1}` : "";
  return `${base} ${descriptor}${suffix}`;
}
function assetPath(category: string, file: string) { return `/assets/${encodeURIComponent(category)}/${encodeURIComponent(file)}`; }
export function getCatalog(categoryId?: string): CatalogProduct[] { if (!fs.existsSync(assetsDirectory)) return []; const requestedCategory = categoryId ? canonicalCategoryId(categoryId) : undefined; return fs.readdirSync(assetsDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name.toLowerCase() !== "projects").sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => { const entryCategoryId = canonicalCategoryId(entry.name); const files = fs.readdirSync(path.join(assetsDirectory, entry.name)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); const category = label(entry.name); return files.map((file, index) => { const name = productDisplayName(category, index); const image = assetPath(entry.name, file); const id = slug(name);
    const product = { id, name, category, price: categoryPrices[entryCategoryId] ?? 35000, image, gallery: [image] };
    return !requestedCategory || requestedCategory === entryCategoryId ? product : null; }).filter((product): product is CatalogProduct => product !== null); }); }
export function getProduct(id: string) { return getCatalog().find((product) => product.id === slug(id) || product.id === canonicalCategoryId(id)); }
export function getCatalogCategories(loadImages = true): CatalogCategory[] { if (!fs.existsSync(assetsDirectory)) return []; return fs.readdirSync(assetsDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name.toLowerCase() !== "projects").sort((a, b) => a.name.localeCompare(b.name)).map((entry) => { const file = loadImages ? fs.readdirSync(path.join(assetsDirectory, entry.name)).find((item) => /\.(jpe?g|png|webp)$/i.test(item)) : undefined; const category = label(entry.name); return { id: canonicalCategoryId(entry.name), name: category, category, image: file ? assetPath(entry.name, file) : "" }; }); }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const relatedProducts = getCatalog().filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const inquiryMessage = [`Patio King product inquiry`, `Product: ${product.name}`, `Category: ${product.category}`, `Product ID: ${product.id}`, `Price: LKR ${product.price.toLocaleString("en-LK")}`, `Details: ${product.category} available for inquiry.`].join("\n");
  const inquiryHref = `https://wa.me/94773424994?text=${encodeURIComponent(inquiryMessage)}`;
  return <PageFrame><section className="product-detail-page"><Link className="back-link" href="/shop"><span aria-hidden="true">←</span> Back to Shop</Link><div className="detail-main"><ProductGallery images={[product.image]} name={product.name} /><div className="detail-copy"><h1>{product.name}</h1><div className="rating">★★★★★ <small>{product.category}</small></div><div className="detail-price"><b>LKR {product.price.toLocaleString("en-LK")}</b></div><p>A thoughtfully selected {product.category.toLowerCase()} piece from Patio King, made to bring comfort, character, and lasting style to modern interiors.</p><div className="detail-actions"><a className="buy" href={inquiryHref} target="_blank" rel="noreferrer">Inquire Now <span aria-hidden="true">→</span></a></div><ProductShare productName={product.name} /><small>Category: {product.category}</small><small>Details: {product.category}, modern furniture, home furniture.</small></div></div><ProductTabs name={product.name} category={product.category} products={relatedProducts} /></section></PageFrame>;
}
