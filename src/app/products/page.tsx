import Link from "next/link";
import { PageFrame, productImages, productNames } from "@/components/PatioShell";
import { furnitureCategories } from "@/components/PatioShell";
import { CategoryRail } from "@/components/CategoryRail";
import { ProductsBrowser } from "@/components/ProductsBrowser";

export default function ProductsPage() {
  return <PageFrame><section className="inner-hero"><small>OUR COLLECTION</small><h1>Furniture Made for<br /><em>Modern Living</em></h1><p>Explore thoughtfully designed furniture combining contemporary aesthetics, comfort and lasting craftsmanship.</p></section><CategoryRail /><section className="catalog"><div className="catalog-heading"><div><small>SHOP ALL PIECES</small><h2>Find your next favorite.</h2><p>Search, sort and filter our furniture collection by the details that matter to you.</p></div></div><ProductsBrowser /></section></PageFrame>;
}
