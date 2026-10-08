"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CatalogCategory } from "@/app/products/[id]/page";

type ShopCategory = { id: string; label: string; imageCategoryId: string; subcategories: { id: string; label: string; catalogCategories?: string[] }[] };

export function CategoryRail({ categories, shopCategories, selectedGroup, selectedSubcategory }: { categories: CatalogCategory[]; shopCategories: ShopCategory[]; selectedGroup?: string; selectedSubcategory?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const selectFilter = (href: string) => startTransition(() => router.push(href));
  const imageFor = (group: ShopCategory) => categories.find((category) => category.id === group.imageCategoryId)?.image ?? categories[0]?.image ?? "";
  const activeGroup = shopCategories.find((group) => group.id === selectedGroup) ?? shopCategories[0];
  return <section className={`shop-category-explorer ${isPending ? "is-filtering" : ""}`} aria-label="Furniture categories"><div className="category-rail"><div className="category-rail-track">{shopCategories.map((group) => <button className={`category-bubble ${selectedGroup === group.id ? "active" : ""}`} type="button" onClick={() => selectFilter(`/shop?group=${group.id}`)} key={group.id}><span><img src={imageFor(group)} alt="" /></span>{group.label}</button>)}</div></div><nav className="subcategory-rail" aria-label={`${activeGroup.label} subcategories`}>{activeGroup.subcategories.map((subcategory) => <button className={selectedSubcategory === subcategory.id ? "active" : ""} type="button" onClick={() => selectFilter(`/shop?group=${activeGroup.id}&category=${subcategory.id}`)} key={`${activeGroup.id}-${subcategory.id}`}>{subcategory.label}</button>)}</nav></section>;
}
