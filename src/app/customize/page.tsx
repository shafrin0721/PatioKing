import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";
import { CustomizeExperience } from "@/components/CustomizeExperience";
import { canonicalCategoryId, getCatalog, getCatalogCategories, getProduct } from "@/app/products/[id]/page";

export default async function CustomizePage({ searchParams }: { searchParams: Promise<{ category?: string; productId?: string }> }) {
  const { category, productId } = await searchParams;
  const catalogCategories = getCatalogCategories(true);
  const wardrobeImage = catalogCategories.find((item) => item.id === "cupboard")?.image ?? catalogCategories[0]?.image ?? "";
  const categories = [...catalogCategories, { id: "wardrobe", name: "Wardrobe", category: "Wardrobe", image: wardrobeImage }];
  const canonicalCategory = category === "wardrobe" ? "wardrobe" : category ? canonicalCategoryId(category) : undefined;
  const wardrobe = getProduct("wardrobe");
  const products = productId ? (getProduct(productId) ? [getProduct(productId)!] : []) : canonicalCategory === "wardrobe" && wardrobe ? [wardrobe] : canonicalCategory ? getCatalog(canonicalCategory) : [];
  const selectedProduct = productId ? getProduct(productId) : undefined;

  if (productId && !selectedProduct) {
    return <PageFrame><section className="customizer-page customizer-empty"><small>PRODUCT NOT FOUND</small><h1>We couldn&apos;t find<br /><em>that piece.</em></h1><p>The requested product is no longer available.</p><Link className="dark-button" href="/shop">Back to shop <span>→</span></Link></section></PageFrame>;
  }

  return <CustomizeExperience selectedProduct={selectedProduct} products={products} categories={categories} selectedCategory={canonicalCategory} />;
}
