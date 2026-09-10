import Link from "next/link";
import { PageFrame, productGalleries, productImages, productNames } from "@/components/PatioShell";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductGallery } from "@/components/ProductGallery";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = Math.max(0, Number(id) - 1) % productNames.length;
  const name = productNames[index];
  const gallery = productGalleries[index % productGalleries.length];
  return <PageFrame><section className="product-detail-page"><Link className="back-link" href="/products">← Back to Products</Link><div className="detail-main"><ProductGallery images={gallery} name={name} /><div className="detail-copy"><h1>{name} <span>In Stock</span></h1><div className="rating">★★★★★ <small>4 Review　·　SKU: 2,51,594</small></div><div className="detail-price"><s>Rs.12,500.00</s> <b>Rs.10,875.00</b> <em>13% off</em></div><p>A beautifully crafted wooden chair featuring a curved walnut frame and cushioned seat, designed to bring warmth, comfort, and timeless elegance to modern interiors.</p><div className="quantity">−　1　+</div><div className="detail-actions"><Link className="customize-action" href="/customize">Customize this piece</Link><Link href="/cart">Add Cart</Link><Link className="buy" href="/checkout">Buy Now</Link></div><small>Category: Chairs</small><small>Tag: Wooden Chair, Lounge Chair, Walnut Furniture, Dining Chair,<br />Modern Furniture, Indoor Furniture, Premium Chair, Home Furniture</small></div></div><ProductTabs name={name} /></section></PageFrame>;
}
