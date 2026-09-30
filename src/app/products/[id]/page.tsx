import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { PageFrame } from "@/components/PatioShell";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductShare } from "@/components/ProductShare";
import { ProductGallery } from "@/components/ProductGallery";

export type ProductVariant = { label: string; image: string; priceAdjustment: number };
export type CatalogProduct = { id: string; name: string; category: string; room: string; price: number; image: string; gallery: string[]; description: string; narration: string; materials: string[]; colours: string[]; fabrics: string[]; finishes: string[]; dimensions: { width: number; depth: number; height: number }; variants: ProductVariant[] };
export type CatalogCategory = { id: string; name: string; category: string; image: string };
const assetsDirectory = path.join(process.cwd(), "public", "assets");
const categoryPrices: Record<string, number> = { bed: 135000, "bedside-cupboard": 42000, cupboard: 68000, "coffee-table": 52000, "dining-chair": 28000, "dining-table": 125000, divan: 85000, "dressing-table": 78000, "l-sofa": 185000, "pouf-ottoman": 32000, "relaxing-chair": 72000, "rocking-chair": 68000, "round-sofa": 155000, "single-chair": 52000, sofa: 145000, "tv-console": 88000 };
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
export function canonicalCategoryId(value: string) { const normalized = slug(value); const aliases: Record<string, string> = { bedroom: "bed", bedrooms: "bed", living: "sofa", "living-room": "sofa", dining: "dining-table", kitchen: "dining-table", storage: "cupboard", wardrobes: "cupboard", wardrobe: "cupboard" }; return aliases[normalized] ?? singularizeCategoryKey(normalized); }
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
function roomForCategory(categoryId: string) { if (/bed|bedside|divan|dressing/.test(categoryId)) return "Bedroom"; if (/dining/.test(categoryId)) return "Dining"; if (/sofa|chair|ottoman|coffee|tv/.test(categoryId)) return "Living"; if (/cupboard/.test(categoryId)) return "Storage"; return "Living"; }
function productDimensions(categoryId: string) {
  if (/side-table/.test(categoryId)) return { width: 52, depth: 52, height: 56 };
  if (/bedside.*table/.test(categoryId)) return { width: 52, depth: 48, height: 56 };
  if (/coffee-table/.test(categoryId)) return { width: 110, depth: 62, height: 44 };
  if (/dining-table/.test(categoryId)) return { width: 160, depth: 90, height: 76 };
  if (/dressing-table|dresser/.test(categoryId)) return { width: 120, depth: 48, height: 78 };
  if (/bedside-cupboard/.test(categoryId)) return { width: 55, depth: 42, height: 62 };
  if (/tv-console/.test(categoryId)) return { width: 160, depth: 42, height: 55 };
  if (/wardrobe/.test(categoryId)) return { width: 180, depth: 60, height: 210 };
  if (/cupboard/.test(categoryId)) return { width: 100, depth: 50, height: 110 };
  if (/divan/.test(categoryId)) return { width: 180, depth: 200, height: 55 };
  if (/^bed$/.test(categoryId)) return { width: 180, depth: 200, height: 105 };
  if (/l-sofa/.test(categoryId)) return { width: 270, depth: 175, height: 84 };
  if (/round-sofa/.test(categoryId)) return { width: 190, depth: 190, height: 84 };
  if (/sofa/.test(categoryId)) return { width: 220, depth: 95, height: 84 };
  if (/rocking-chair/.test(categoryId)) return { width: 68, depth: 92, height: 104 };
  if (/relaxing-chair/.test(categoryId)) return { width: 78, depth: 88, height: 96 };
  if (/dining-chair/.test(categoryId)) return { width: 48, depth: 56, height: 84 };
  if (/chair/.test(categoryId)) return { width: 72, depth: 78, height: 86 };
  if (/ottoman|pouf/.test(categoryId)) return { width: 58, depth: 58, height: 44 };
  if (/table/.test(categoryId)) return { width: 120, depth: 75, height: 75 };
  return { width: 90, depth: 85, height: 82 };
}
function productDetails(categoryId: string, category: string) { const upholstered = /chair|sofa|divan|ottoman|bed/.test(categoryId); const dimensions = productDimensions(categoryId); return { room: roomForCategory(categoryId), description: `The ${category.toLowerCase()} is designed for considered everyday living, balancing generous proportions with a refined Patio King silhouette. Each detail is made to feel comfortable, useful and at home in a modern space.`, narration: `A ${category.toLowerCase()} with a calm presence and practical proportions, made to bring warmth and character to your home.`, materials: upholstered ? ["Kiln-dried hardwood frame", "High-resilience foam", "Solid wood details"] : ["Solid hardwood", "Engineered wood core", "Durable protective coating"], colours: ["Natural Wood", "Honey Oak", "Walnut", "Matte Black"], fabrics: upholstered ? ["Linen", "Cotton Blend", "Performance Velvet", "Leather"] : [], finishes: ["Natural", "Honey Oak", "Dark Walnut", "Matte Black", "Whitewash"], dimensions }; }
export function getCatalog(categoryId?: string): CatalogProduct[] { if (!fs.existsSync(assetsDirectory)) return []; const requestedCategory = categoryId ? canonicalCategoryId(categoryId) : undefined; return fs.readdirSync(assetsDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name.toLowerCase() !== "projects").sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => { const entryCategoryId = canonicalCategoryId(entry.name); const files = fs.readdirSync(path.join(assetsDirectory, entry.name)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); const category = label(entry.name); return files.map((file, index) => { const name = productDisplayName(category, index); const image = assetPath(entry.name, file); const id = slug(name); const details = productDetails(entryCategoryId, category);
  const product: CatalogProduct = { id, name, category, price: categoryPrices[entryCategoryId] ?? 35000, image, gallery: [image], ...details, variants: details.finishes.map((finish, variantIndex) => ({ label: finish, image, priceAdjustment: variantIndex * 2500 })) };
    return !requestedCategory || requestedCategory === entryCategoryId ? product : null; }).filter((product): product is CatalogProduct => product !== null); }); }
export function getProduct(id: string) {
  const normalizedId = slug(id);
  const catalog = getCatalog();
  const product = catalog.find((item) => item.id === normalizedId || item.id === canonicalCategoryId(id));
  return product;
}
export function getCatalogCategories(loadImages = true): CatalogCategory[] { if (!fs.existsSync(assetsDirectory)) return []; return fs.readdirSync(assetsDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name.toLowerCase() !== "projects").sort((a, b) => a.name.localeCompare(b.name)).map((entry) => { const file = loadImages ? fs.readdirSync(path.join(assetsDirectory, entry.name)).find((item) => /\.(jpe?g|png|webp)$/i.test(item)) : undefined; const category = label(entry.name); return { id: canonicalCategoryId(entry.name), name: category, category, image: file ? assetPath(entry.name, file) : "" }; }); }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const relatedProducts = getCatalog().filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const inquiryMessage = [`Patio King product inquiry`, `Product: ${product.name}`, `Category: ${product.category}`, `Product ID: ${product.id}`, `Price: LKR ${product.price.toLocaleString("en-LK")}`, `Details: ${product.category} available for inquiry.`].join("\n");
  const inquiryHref = `https://wa.me/94773424994?text=${encodeURIComponent(inquiryMessage)}`;
  return <PageFrame><section className="product-detail-page"><Link className="back-link" href="/shop"><span aria-hidden="true">←</span> Back to Shop</Link><div className="detail-main"><ProductGallery images={product.gallery} name={product.name} /><div className="detail-copy"><h1>{product.name}</h1><div className="rating">★★★★★ <small>{product.category} / {product.room}</small></div><div className="detail-price"><b>LKR {product.price.toLocaleString("en-LK")}</b></div><p>{product.description}</p><p className="product-narration">{product.narration}</p><div className="detail-actions"><a className="buy" href={inquiryHref} target="_blank" rel="noreferrer">Inquire Now <span aria-hidden="true">→</span></a><Link className="customize-action" href={`/customize/${product.id}`}>Customize this piece <span aria-hidden="true">→</span></Link></div><ProductShare productName={product.name} /><small>Category: {product.category}</small></div></div><ProductTabs name={product.name} category={product.category} products={relatedProducts} description={product.description} materials={product.materials} finishes={[]} dimensions={product.dimensions} /></section></PageFrame>;
}
