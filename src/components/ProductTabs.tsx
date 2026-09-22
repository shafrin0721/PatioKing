"use client";

import { useState } from "react";
import type { CatalogProduct } from "@/app/products/[id]/page";

export function ProductTabs({ name, category, products }: { name: string; category: string; products: CatalogProduct[] }) {
  const [tab, setTab] = useState("description");
  return <>
    <div className="detail-tabs"><button className={tab === "description" ? "active" : ""} onClick={() => setTab("description")}>Descriptions</button><button className={tab === "information" ? "active" : ""} onClick={() => setTab("information")}>Additional Information</button><button className={tab === "feedback" ? "active" : ""} onClick={() => setTab("feedback")}>Customer Feedback</button></div>
    <div className="detail-description">
      {tab === "description" && <p>The {name} combines elegant craftsmanship with everyday comfort. Its smooth curved wooden frame creates a refined silhouette, while the upholstered cushioned seat provides comfortable support for extended sitting. Designed for modern interiors, it brings warmth and timeless character to your home.</p>}
      {tab === "information" && <div className="product-information"><h3>Additional Information</h3><ul><li>Category: {category}</li><li>Style: Modern / Contemporary</li><li>Suitable for: Indoor use</li><li>Maintenance: Wipe with a soft, dry or slightly damp cloth</li><li>Assembly: Requirements can be specified based on the final configuration</li></ul><h3>Care Instructions</h3><ul><li>Keep away from prolonged direct sunlight and excessive moisture.</li><li>Avoid abrasive cleaners and harsh chemicals.</li><li>Clean spills promptly using a suitable fabric cleaner.</li></ul></div>}
      {tab === "feedback" && <div className="feedback-list"><article><b>Sarah Thomas</b><span>★★★★★</span><p>The wooden finish looks even better in person. The chair gives our living room a much more premium feel.</p></article><article><b>Nimal Perera</b><span>★★★★☆</span><p>The curved back and cushioned seat make it comfortable enough to sit for a long time. The design is also very elegant.</p></article><article><b>Tharushi Kaushalya</b><span>★★★★★</span><p>Really liked the quality of the wood and the overall finish. It fits perfectly with our modern interior.</p></article></div>}
      <h2>Related Products</h2><div className="related-grid">{products.slice(0, 4).map((product) => <article key={product.id}><img src={product.image} alt={product.name} /><p>{product.name}</p></article>)}</div>
    </div>
  </>;
}
