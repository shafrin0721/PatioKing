"use client";

import { useRef } from "react";
import type { CatalogCategory } from "@/app/products/[id]/page";

export function CategoryRail({ categories }: { categories: CatalogCategory[] }) {
  const rail = useRef<HTMLDivElement>(null);
  return <section className="category-rail" aria-label="Furniture categories"><button className="category-arrow" aria-label="Previous categories" onClick={() => rail.current?.scrollBy({ left: -430, behavior: "smooth" })}>‹</button><div className="category-rail-track" ref={rail}>{categories.map((category) => <a className="category-bubble" href={`/products?category=${category.id}`} key={category.id}><span><img src={category.image} alt="" /></span>{category.name}</a>)}</div><button className="category-arrow" aria-label="Next categories" onClick={() => rail.current?.scrollBy({ left: 430, behavior: "smooth" })}>›</button></section>;
}
