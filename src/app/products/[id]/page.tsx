import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { PageFrame } from "@/components/PatioShell";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductGallery } from "@/components/ProductGallery";

export type CatalogProduct = { id: string; name: string; category: string; price: number; image: string; gallery: string[] };
export type CatalogCategory = { id: string; name: string; category: string; image: string };
const assetsDirectory = path.join(process.cwd(), "public", "assets");
const categoryPrices: Record<string, number> = { cupboards: 45000, "dining-chairs": 18000, "dining-tables": 65000, divan: 85000, "dressing-tables": 55000, poufottoman: 22000, "relaxing-chairs": 42000, "rocking-chairs": 48000, "round-sofa": 125000, "single-chairs": 32000, sofa: 110000, "tv-console": 58000 };
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function canonicalCategoryId(value: string) { const id = slug(value); return id === "sofas" ? "sofa" : id === "tables" ? "dining-tables" : id; }
function label(value: string) { return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()); }
function assetPath(category: string, file: string) { return `/assets/${encodeURIComponent(category)}/${encodeURIComponent(file)}`; }
export function getCatalog(categoryId?: string): CatalogProduct[] { if (!fs.existsSync(assetsDirectory)) return []; const requestedCategory = categoryId ? canonicalCategoryId(categoryId) : undefined; let nextId = 1; return fs.readdirSync(assetsDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => { const entryCategoryId = canonicalCategoryId(entry.name); const files = fs.readdirSync(path.join(assetsDirectory, entry.name)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); const category = label(entry.name); return files.map((file, index) => { const image = assetPath(entry.name, file); const product = { id: String(nextId++), name: `${category} ${String(index + 1).padStart(2, "0")}`, category, price: categoryPrices[entryCategoryId] ?? 35000, image, gallery: [image] }; return !requestedCategory || requestedCategory === entryCategoryId ? product : null; }).filter((product): product is CatalogProduct => product !== null); }); }
export function getProduct(id: string) { return getCatalog().find((product) => product.id === id); }
export function getCatalogCategories(): CatalogCategory[] { if (!fs.existsSync(assetsDirectory)) return []; return fs.readdirSync(assetsDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => { const file = fs.readdirSync(path.join(assetsDirectory, entry.name)).find((item) => /\.(jpe?g|png|webp)$/i.test(item)); const category = label(entry.name); return { id: slug(entry.name), name: category, category, image: file ? assetPath(entry.name, file) : "" }; }).filter((category) => category.image); }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const relatedProducts = getCatalog().filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const customizeHref = `/customize?productId=${product.id}`;
  return <PageFrame><section className="product-detail-page"><Link className="back-link" href="/products">← Back to Products</Link><div className="detail-main"><ProductGallery images={[product.image]} name={product.name} /><div className="detail-copy"><h1>{product.name} <span>In Stock</span></h1><div className="rating">★★★★★ <small>4 Review　·　SKU: {product.id.toUpperCase()}</small></div><div className="detail-price"><b>Rs.{product.price.toLocaleString()}.00</b></div><p>A thoughtfully selected {product.category.toLowerCase()} piece from Patio King, made to bring comfort, character, and lasting style to modern interiors.</p><div className="quantity">−　1　+</div><div className="detail-actions"><Link className="customize-action" href={customizeHref}>Customize this piece</Link><Link href="/cart">Add Cart</Link><Link className="buy" href="/checkout">Buy Now</Link></div><small>Category: {product.category}</small><small>Tag: {product.category}, Modern Furniture, Home Furniture</small></div></div><ProductTabs name={product.name} category={product.category} products={relatedProducts} /></section></PageFrame>;
}
