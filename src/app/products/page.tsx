import { PageFrame } from "@/components/PatioShell";
import { CategoryRail } from "@/components/CategoryRail";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { getCatalog, getCatalogCategories } from "@/app/products/[id]/page";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allProducts = getCatalog();
  const products = category ? allProducts.filter((product) => product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === category) : allProducts;
  const categories = getCatalogCategories();
  const selectedCategory = categories.find((item) => item.id === category);
  return <PageFrame><section className="inner-hero"><small>OUR COLLECTION</small><h1>Furniture Made for<br /><em>Modern Living</em></h1><p>Explore thoughtfully designed furniture combining contemporary aesthetics, comfort and lasting craftsmanship.</p></section><CategoryRail categories={categories} /><section className="catalog"><div className="catalog-heading"><div><small>{selectedCategory ? selectedCategory.name : "SHOP ALL PIECES"}</small><h2>{selectedCategory ? `${selectedCategory.name} Collection` : "Find your next favorite."}</h2><p>Search, sort and filter our furniture collection by the details that matter to you.</p></div></div><ProductsBrowser products={products} /></section></PageFrame>;
}
