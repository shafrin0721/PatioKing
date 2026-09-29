import { PageFrame } from "@/components/PatioShell";
import { CategoryRail } from "@/components/CategoryRail";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { canonicalCategoryId, getCatalog, getCatalogCategories } from "@/app/products/[id]/page";

export type ShopCategory = { id: string; label: string; subcategories: { id: string; label: string }[] };
export const shopCategories: ShopCategory[] = [
  { id: "living", label: "Living Room", subcategories: [{ id: "l-sofa", label: "L Sofas" }, { id: "sofa", label: "Sofas" }, { id: "round-sofa", label: "Round Sofas" }, { id: "single-chair", label: "Armchairs / Single Chairs" }, { id: "relaxing-chair", label: "Relaxing Chairs" }, { id: "rocking-chair", label: "Rocking Chairs" }, { id: "coffee-table", label: "Coffee Tables" }, { id: "coffee-table", label: "Side Tables" }, { id: "tv-console", label: "TV Consoles" }, { id: "pouf-ottoman", label: "Poufs / Ottomans" }] },
  { id: "bedroom", label: "Bedroom", subcategories: [{ id: "bed", label: "Beds" }, { id: "bedside-cupboard", label: "Bedside Tables" }, { id: "cupboard", label: "Wardrobes / Cupboards" }, { id: "dressing-table", label: "Dressing Tables" }, { id: "divan", label: "Divans" }, { id: "single-chair", label: "Bedroom Chairs" }, { id: "pouf-ottoman", label: "Bedroom Benches" }] },
  { id: "dining", label: "Dining", subcategories: [{ id: "dining-table", label: "Dining Tables" }, { id: "dining-chair", label: "Dining Chairs" }, { id: "single-chair", label: "Dining Benches" }, { id: "dining-table", label: "Dining Sets" }, { id: "cupboard", label: "Dining Storage / Cabinets" }] },
  { id: "kitchen", label: "Kitchen", subcategories: [{ id: "dining-chair", label: "Bar Stools" }, { id: "dining-table", label: "Kitchen Tables" }, { id: "cupboard", label: "Kitchen Cabinets" }, { id: "bedside-cupboard", label: "Kitchen Storage" }] },
  { id: "storage", label: "Storage", subcategories: [{ id: "cupboard", label: "Wardrobes" }, { id: "cupboard", label: "Cupboards" }, { id: "tv-console", label: "Cabinets" }, { id: "bedside-cupboard", label: "Shelves" }, { id: "tv-console", label: "TV Storage" }, { id: "cupboard", label: "Sideboards" }] },
  { id: "accent-decor", label: "Accent & Décor Furniture", subcategories: [{ id: "pouf-ottoman", label: "Poufs" }, { id: "pouf-ottoman", label: "Ottomans" }, { id: "single-chair", label: "Benches" }, { id: "coffee-table", label: "Side Tables" }, { id: "tv-console", label: "Console Tables" }, { id: "single-chair", label: "Accent Chairs" }] },
];

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; group?: string }> }) {
  const { category, group } = await searchParams;
  const allProducts = getCatalog();
  const selectedGroup = shopCategories.find((item) => item.id === group);
  const selectedSubcategory = category ? canonicalCategoryId(category) : undefined;
  const groupProducts = selectedGroup ? Array.from(new Map(selectedGroup.subcategories.flatMap((item) => getCatalog(item.id)).map((product) => [product.id, product])).values()) : allProducts;
  const products = selectedSubcategory ? getCatalog(selectedSubcategory) : groupProducts;
  const categories = getCatalogCategories();
  const selectedLabel = selectedGroup?.subcategories.find((item) => item.id === selectedSubcategory)?.label;
  const heading = selectedLabel ?? selectedGroup?.label ?? "SHOP ALL PIECES";
  return <PageFrame><section className="inner-hero"><small>OUR COLLECTION</small><h1>Furniture Made for<br /><em>Modern Living</em></h1><p>Explore thoughtfully designed furniture combining contemporary aesthetics, comfort and lasting craftsmanship.</p></section><CategoryRail categories={categories} shopCategories={shopCategories} selectedGroup={selectedGroup?.id} selectedSubcategory={selectedSubcategory} /><section className="catalog"><div className="catalog-heading"><div><small>{heading}</small><h2>{selectedGroup ? `${heading} Collection` : "Find your next favorite."}</h2><p>Search, sort and filter our furniture collection by the details that matter to you.</p></div></div><ProductsBrowser products={products} /></section></PageFrame>;
}
