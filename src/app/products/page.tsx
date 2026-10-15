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

const catalogPageSize = 24;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string | string[]; group?: string | string[]; q?: string | string[]; sort?: string | string[]; price?: string | string[]; page?: string | string[] }> }) {
  const params = await searchParams;
  const getParam = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
  const category = getParam(params.category);
  const group = getParam(params.group);
  const search = getParam(params.q).trim();
  const requestedSort = getParam(params.sort);
  const sort = ["az", "za", "low", "high"].includes(requestedSort) ? requestedSort : "featured";
  const requestedPrice = getParam(params.price);
  const price = ["20000", "50000", "100000"].includes(requestedPrice) ? requestedPrice : "all";
  const requestedPage = Number.parseInt(getParam(params.page), 10);
  const allProducts = getCatalog();
  const selectedGroup = shopCategories.find((item) => item.id === group);
  const selectedSubcategory = category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const selectedSubcategoryDefinition = selectedGroup?.subcategories.find((item) => item.id === selectedSubcategory);
  const catalogSubcategories = selectedSubcategoryDefinition?.catalogCategories ?? (category ? [canonicalCategoryId(category)] : undefined);
  const getUniqueProducts = (categoryIds: string[]) => Array.from(new Map(categoryIds.flatMap((categoryId) => getCatalog(categoryId)).map((product) => [product.id, product])).values());
  const groupProducts = selectedGroup ? getUniqueProducts([...new Set(selectedGroup.subcategories.flatMap((item) => item.catalogCategories ?? [item.id]))]) : allProducts;
  const categoryProducts = catalogSubcategories ? getUniqueProducts(catalogSubcategories) : groupProducts;
  const filteredProducts = categoryProducts.filter((product) => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (price === "all" || product.price <= Number(price));
  });
  if (sort === "az") filteredProducts.sort((first, second) => first.name.localeCompare(second.name));
  if (sort === "za") filteredProducts.sort((first, second) => second.name.localeCompare(first.name));
  if (sort === "low") filteredProducts.sort((first, second) => first.price - second.price);
  if (sort === "high") filteredProducts.sort((first, second) => second.price - first.price);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogPageSize));
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1;
  const products = filteredProducts.slice((currentPage - 1) * catalogPageSize, currentPage * catalogPageSize);
  const categories = getCatalogCategories();
  const selectedLabel = selectedSubcategoryDefinition?.label;
  const heading = selectedLabel ?? selectedGroup?.label ?? "SHOP ALL PIECES";
  return <PageFrame><section className="inner-hero"><small>OUR COLLECTION</small><h1>Furniture Made for<br /><em>Modern Living</em></h1><p>Explore thoughtfully designed furniture combining contemporary aesthetics, comfort and lasting craftsmanship.</p></section><CategoryRail categories={categories} shopCategories={shopCategories} selectedGroup={selectedGroup?.id} selectedSubcategory={selectedSubcategory} /><section className="catalog"><div className="catalog-heading"><div><small>{heading}</small><h2>{selectedGroup ? `${heading} Collection` : "Find your next favorite."}</h2><p>Search, sort and filter our furniture collection by the details that matter to you.</p></div></div><ProductsBrowser products={products} totalProducts={filteredProducts.length} currentPage={currentPage} totalPages={totalPages} pageSize={catalogPageSize} search={search} sort={sort} price={price} group={selectedGroup?.id} category={selectedSubcategoryDefinition?.id ?? (category || undefined)} /></section></PageFrame>;
}
