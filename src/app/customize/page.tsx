import Link from "next/link";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/PatioShell";
import { CustomizeExperience } from "@/components/CustomizeExperience";
import { canonicalCategoryId, getCatalog, getCatalogCategories, getProduct } from "@/app/products/[id]/page";

export default async function CustomizePage({ searchParams }: { searchParams: Promise<{ category?: string; productId?: string }> }) {
  const { category, productId } = await searchParams;
  if (productId) redirect(`/customize/${encodeURIComponent(productId)}`);
  const catalogCategories = getCatalogCategories(true);
  const categories = catalogCategories;
  const canonicalCategory = category ? canonicalCategoryId(category) : undefined;
  const products = canonicalCategory ? getCatalog(canonicalCategory) : [];
  const selectedProduct = productId ? getProduct(productId) : undefined;

  if (productId && !selectedProduct) {
    return <PageFrame><section className="customizer-page customizer-empty"><small>PRODUCT NOT FOUND</small><h1>We couldn&apos;t find<br /><em>that piece.</em></h1><p>The requested product is no longer available.</p><Link className="dark-button" href="/shop">Back to shop <span>→</span></Link></section></PageFrame>;
  }

  return <CustomizeExperience key={`${productId ?? "chooser"}-${canonicalCategory ?? "all"}`} selectedProduct={selectedProduct} products={products} categories={categories} selectedCategory={canonicalCategory} />;
}
