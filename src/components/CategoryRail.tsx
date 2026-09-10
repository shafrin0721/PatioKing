"use client";

import { useRef } from "react";
import { furnitureCategories } from "./PatioShell";

const categoryImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=300&q=80",
];

export function CategoryRail() {
  const rail = useRef<HTMLDivElement>(null);
  return <section className="category-rail" aria-label="Furniture categories"><button className="category-arrow" aria-label="Previous categories" onClick={() => rail.current?.scrollBy({ left: -430, behavior: "smooth" })}>‹</button><div className="category-rail-track" ref={rail}>{furnitureCategories.map((category, index) => <a className="category-bubble" href={`#${category.toLowerCase().replace(/[^a-z]+/g, "-")}`} key={category}><span><img src={categoryImages[index % categoryImages.length]} alt="" /></span>{category}</a>)}</div><button className="category-arrow" aria-label="Next categories" onClick={() => rail.current?.scrollBy({ left: 430, behavior: "smooth" })}>›</button></section>;
}
