import Link from "next/link";
import { CustomizeExperience } from "@/components/CustomizeExperience";
import { getCatalog, getProduct } from "@/app/products/[id]/page";

export default async function CustomizePage({ searchParams }: { searchParams: Promise<{ productId?: string }> }) {
  const { productId } = await searchParams;
  const products = getCatalog();
  const selectedProduct = productId ? getProduct(productId) : undefined;

  if (productId && !selectedProduct) {
    return <main className="reference-site"><section className="customizer-page customizer-empty"><small>PRODUCT NOT FOUND</small><h1>We couldn&apos;t find<br /><em>that piece.</em></h1><p>The requested product is no longer available.</p><Link className="dark-button" href="/products">Back to products <span>→</span></Link></section></main>;
  }

  return <CustomizeExperience selectedProduct={selectedProduct} products={products} />;
}
