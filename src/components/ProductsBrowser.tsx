"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import type { CatalogProduct } from "@/app/products/[id]/page";

type ProductsBrowserProps = {
  products: CatalogProduct[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  search: string;
  sort: string;
  price: string;
  group?: string;
  category?: string;
};

export function ProductsBrowser({ products, totalProducts, currentPage, totalPages, pageSize, search, sort, price, group, category }: ProductsBrowserProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inquiryHref = (product: CatalogProduct) => `https://wa.me/94773424994?text=${encodeURIComponent(["Patio King product inquiry", `Product: ${product.name}`, `Category: ${product.category}`, `Product ID: ${product.id}`, `Price: LKR ${product.price.toLocaleString("en-LK")}`].join("\n"))}`;
  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    if (group) params.set("group", group);
    if (category) params.set("category", category);

    const query = String(formData.get("q") ?? "").trim();
    const selectedSort = String(formData.get("sort") ?? "featured");
    const selectedPrice = String(formData.get("price") ?? "all");
    if (query) params.set("q", query);
    if (selectedSort !== "featured") params.set("sort", selectedSort);
    if (selectedPrice !== "all") params.set("price", selectedPrice);

    const searchParams = params.toString();
    startTransition(() => router.push(searchParams ? `/shop?${searchParams}` : "/shop"));
  };
  const queryHref = (page: number, includeFilters = true) => {
    const params = new URLSearchParams();
    if (group) params.set("group", group);
    if (category) params.set("category", category);
    if (includeFilters && search) params.set("q", search);
    if (includeFilters && sort !== "featured") params.set("sort", sort);
    if (includeFilters && price !== "all") params.set("price", price);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  };
  const clearFiltersHref = queryHref(1, false);
  return <>
    <form action="/shop" method="get" className="store-filters product-page-filters" onSubmit={applyFilters}>
      {group && <input type="hidden" name="group" value={group} />}
      {category && <input type="hidden" name="category" value={category} />}
      <div className="filter-search-group"><label>Search<input name="q" defaultValue={search} placeholder="Search products..." /></label><button className="clear-filters filter-search-submit" type="submit" disabled={isPending}>{isPending ? "Searching..." : "Search"}</button></div>
      <label>Sort by<select name="sort" defaultValue={sort}><option value="featured">Featured</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select></label>
      <label>Price<select name="price" defaultValue={price}><option value="all">All prices</option><option value="20000">Under Rs.20,000</option><option value="50000">Under Rs.50,000</option><option value="100000">Under Rs.100,000</option></select></label>
      <Link className="clear-filters" href={clearFiltersHref}>Clear filters</Link>
    </form>
    <div className="catalog-count">Showing {products.length ? (currentPage - 1) * pageSize + 1 : 0}–{(currentPage - 1) * pageSize + products.length} of {totalProducts} pieces</div>
    {products.length > 0 ? <div className="product-grid reference-grid">{products.map((product) => <article className="reference-product" id={product.id} key={product.id}><Link href={`/shop/${product.id}`}><div><img src={product.image} alt={product.name} loading="lazy" /></div><h3>{product.name}</h3><span>{product.category}</span><strong>LKR {product.price.toLocaleString("en-LK")}</strong></Link><a className="catalog-inquiry-link" href={inquiryHref(product)} target="_blank" rel="noreferrer"><span className="catalog-inquiry-label">Inquire Now</span><span className="catalog-inquiry-arrow" aria-hidden="true">→</span></a></article>)}</div> : <div className="catalog-empty-state" role="status"><h3>No products found</h3><p>Try changing your search or filters to see more pieces.</p><Link href="/shop">Browse all pieces</Link></div>}
    {totalPages > 1 && <nav className="catalog-pagination" aria-label="Catalog pages">
      {currentPage > 1 && <Link href={queryHref(currentPage - 1)}>Previous</Link>}
      <span>Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && <Link href={queryHref(currentPage + 1)}>Next</Link>}
    </nav>}
  </>;
}
