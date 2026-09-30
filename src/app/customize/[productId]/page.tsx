import { notFound } from "next/navigation";
import { FurnitureConfigurator } from "@/components/FurnitureConfigurator";
import { getProduct } from "@/app/products/[id]/page";

export default async function ProductCustomizePage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = getProduct(productId);
  if (!product) notFound();
  return <FurnitureConfigurator key={product.id} product={product} />;
}