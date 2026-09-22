"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/app/products/[id]/page";

export function ProductsBrowser({ products }: { products: CatalogProduct[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [price, setPrice] = useState("all");
  const visibleProducts = useMemo(() => products.filter((product) => {
    const query = search.toLowerCase();
    return (!query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)) && (price === "all" || product.price <= Number(price));
  }).sort((first, second) => {
    if (sort === "az") return first.name.localeCompare(second.name);
    if (sort === "za") return second.name.localeCompare(first.name);
    if (sort === "low") return first.price - second.price;
    if (sort === "high") return second.price - first.price;
    return 0;
  }), [price, products, search, sort]);

  const clearFilters = () => { setSearch(""); setSort("featured"); setPrice("all"); };
  return <>
    <div className="store-filters product-page-filters"><label>Search<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." /></label><label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select></label><label>Price<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">All prices</option><option value="20000">Under Rs.20,000</option><option value="50000">Under Rs.50,000</option><option value="100000">Under Rs.100,000</option></select></label><button className="clear-filters" onClick={clearFilters}>Clear filters</button></div><div className="catalog-count">Showing {visibleProducts.length} pieces</div><div className="product-grid reference-grid">{visibleProducts.map((product) => <Link className="reference-product" href={`/products/${product.id}`} id={product.id} key={product.id}><div><img src={product.image} alt={product.name} /></div><h3>{product.name}</h3><span>{product.category}</span><strong>Rs.{product.price.toLocaleString()}</strong></Link>)}</div>
  </>;
}
