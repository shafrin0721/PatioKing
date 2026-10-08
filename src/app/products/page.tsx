import { PageFrame } from "@/components/PatioShell";
import { CategoryRail } from "@/components/CategoryRail";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { canonicalCategoryId, getCatalog, getCatalogCategories } from "@/app/products/[id]/page";

export type ShopCategory = { id: string; label: string; imageCategoryId: string; subcategories: { id: string; label: string; catalogCategories?: string[] }[] };
export const shopCategories: ShopCategory[] = [
  { id: "living", label: "Living", imageCategoryId: "sofa", subcategories: [{ id: "l-sofas", label: "L Sofas", catalogCategories: ["l-sofa"] }, { id: "sofas", label: "Sofas", catalogCategories: ["sofa"] }, { id: "round-sofas", label: "Round Sofas", catalogCategories: ["round-sofa"] }, { id: "armchairs-single-chairs", label: "Armchairs / Single Chairs", catalogCategories: ["single-chair"] }, { id: "relaxing-chairs", label: "Relaxing Chairs", catalogCategories: ["relaxing-chair"] }, { id: "rocking-chairs", label: "Rocking Chairs", catalogCategories: ["rocking-chair"] }, { id: "coffee-tables", label: "Coffee Tables", catalogCategories: ["coffee-table"] }, { id: "side-tables", label: "Side Tables", catalogCategories: ["coffee-table"] }, { id: "tv-consoles-storage", label: "TV Consoles & Storage", catalogCategories: ["tv-console", "cupboard"] }] },
  { id: "bedroom", label: "Bedroom", imageCategoryId: "bed", subcategories: [{ id: "beds", label: "Beds", catalogCategories: ["bed"] }, { id: "bedside-tables-storage", label: "Bedside Tables & Storage", catalogCategories: ["bedside-cupboard"] }, { id: "wardrobes-cupboards", label: "Wardrobes / Cupboards", catalogCategories: ["cupboard"] }, { id: "dressing-tables", label: "Dressing Tables", catalogCategories: ["dressing-table"] }] },
  { id: "kitchen-dining", label: "Kitchen & Dining", imageCategoryId: "dining-table", subcategories: [{ id: "dining-tables-sets", label: "Dining Tables & Sets", catalogCategories: ["dining-table"] }, { id: "kitchen-tables", label: "Kitchen Tables", catalogCategories: ["dining-table"] }, { id: "dining-chairs", label: "Dining Chairs", catalogCategories: ["dining-chair"] }, { id: "bar-stools", label: "Bar Stools", catalogCategories: ["dining-chair"] }] },
  { id: "outdoor", label: "Outdoor", imageCategoryId: "relaxing-chair", subcategories: [{ id: "relaxing-chair", label: "Outdoor Chairs" }, { id: "single-chair", label: "Outdoor Seating" }, { id: "coffee-table", label: "Outdoor Tables" }] },
  { id: "accent-decor", label: "Accents & Décor Furniture", imageCategoryId: "pouf-ottoman", subcategories: [{ id: "accent-poufs", label: "Poufs", catalogCategories: ["pouf-ottoman"] }, { id: "accent-ottomans", label: "Ottomans", catalogCategories: ["pouf-ottoman"] }, { id: "benches", label: "Benches", catalogCategories: ["single-chair"] }, { id: "accent-side-tables", label: "Side Tables", catalogCategories: ["coffee-table"] }, { id: "console-tables", label: "Console Tables", catalogCategories: ["tv-console"] }, { id: "accent-chairs", label: "Accent Chairs", catalogCategories: ["single-chair"] }] },
];

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; group?: string }> }) {
  const { category, group } = await searchParams;
  const allProducts = getCatalog();
  const selectedGroup = shopCategories.find((item) => item.id === group);
  const selectedSubcategory = category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const selectedSubcategoryDefinition = selectedGroup?.subcategories.find((item) => item.id === selectedSubcategory);
  const catalogSubcategories = selectedSubcategoryDefinition?.catalogCategories ?? (category ? [canonicalCategoryId(category)] : undefined);
  const getUniqueProducts = (categoryIds: string[]) => Array.from(new Map(categoryIds.flatMap((categoryId) => getCatalog(categoryId)).map((product) => [product.id, product])).values());
  const groupProducts = selectedGroup ? getUniqueProducts([...new Set(selectedGroup.subcategories.flatMap((item) => item.catalogCategories ?? [item.id]))]) : allProducts;
  const products = catalogSubcategories ? getUniqueProducts(catalogSubcategories) : groupProducts;
  const categories = getCatalogCategories();
  const selectedLabel = selectedSubcategoryDefinition?.label;
  const heading = selectedLabel ?? selectedGroup?.label ?? "SHOP ALL PIECES";
  return <PageFrame><section className="inner-hero"><small>OUR COLLECTION</small><h1>Furniture Made for<br /><em>Modern Living</em></h1><p>Explore thoughtfully designed furniture combining contemporary aesthetics, comfort and lasting craftsmanship.</p></section><CategoryRail categories={categories} shopCategories={shopCategories} selectedGroup={selectedGroup?.id} selectedSubcategory={selectedSubcategory} /><section className="catalog"><div className="catalog-heading"><div><small>{heading}</small><h2>{selectedGroup ? `${heading} Collection` : "Find your next favorite."}</h2><p>Search, sort and filter our furniture collection by the details that matter to you.</p></div></div><ProductsBrowser products={products} /></section></PageFrame>;
}
