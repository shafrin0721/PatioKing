"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogProduct } from "@/app/products/[id]/page";
import { ProductFeedback } from "@/components/ProductFeedback";

export function ProductTabs({ productId, name, category, products, description, materials = [], finishes = [], dimensions }: { productId: string; name: string; category: string; products: CatalogProduct[]; description?: string; materials?: string[]; finishes?: string[]; dimensions?: { width: number; depth: number; height: number } }) {
  const [tab, setTab] = useState("description");
  const inquiryHref = (product: CatalogProduct) => `https://wa.me/94773424994?text=${encodeURIComponent(["Patio King product inquiry", `Product: ${product.name}`, `Category: ${product.category}`, `Product ID: ${product.id}`, `Price: LKR ${product.price.toLocaleString("en-LK")}`].join("\n"))}`;
  return <>
    <div className="detail-tabs"><button className={tab === "description" ? "active" : ""} onClick={() => setTab("description")}>Descriptions</button><button className={tab === "information" ? "active" : ""} onClick={() => setTab("information")}>Additional Information</button><button className={tab === "feedback" ? "active" : ""} onClick={() => setTab("feedback")}>Customer Feedback</button></div>
    <div className="detail-description">
      {tab === "description" && <p>{description ?? `The ${name} combines elegant craftsmanship with everyday comfort for modern interiors.`}</p>}
      {tab === "information" && <div className="product-information"><h3>Additional Information</h3><ul><li>Category: {category}</li><li>Materials: {materials.join(", ") || "Made to specification"}</li>{finishes.length > 0 && <li>Available finishes: {finishes.join(", ")}</li>}{dimensions && <li>Standard dimensions: {dimensions.width} W x {dimensions.depth} D x {dimensions.height} H cm</li>}<li>Maintenance: Wipe with a soft, dry or slightly damp cloth</li><li>Assembly: Requirements can be specified based on the final configuration</li></ul><h3>Care Instructions</h3><ul><li>Keep away from prolonged direct sunlight and excessive moisture.</li><li>Avoid abrasive cleaners and harsh chemicals.</li></ul></div>}
      {tab === "feedback" && <ProductFeedback productId={productId} />}
      <h2>Related Products</h2><div className="related-grid">{products.slice(0, 4).map((product) => <article className="related-product-card" key={product.id}><Link className="related-product-link" href={`/shop/${product.id}`}><img src={product.image} alt={product.name} /><p>{product.name}</p><small>LKR {product.price.toLocaleString("en-LK")}</small></Link><a className="related-inquiry-link" href={inquiryHref(product)} target="_blank" rel="noreferrer">Inquire Now <span aria-hidden="true">→</span></a></article>)}</div>
    </div>
  </>;
}
