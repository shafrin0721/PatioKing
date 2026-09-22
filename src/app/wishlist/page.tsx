import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";
import { getCatalog } from "@/app/products/[id]/page";
export default function WishlistPage() { const products = getCatalog().slice(0, 3); return <PageFrame><section className="wishlist-page"><h1>My Wishlist</h1><div className="wishlist-table"><div className="wishlist-head">PRODUCT <span>PRICE</span><span>STOCK STATUS</span></div>{products.map((product) => <div className="wishlist-row" key={product.id}><img src={product.image} alt="" /><b>{product.name}</b><span>Rs.{product.price.toLocaleString()}</span><span className="in">In Stock</span><Link href="/cart">Add to Cart</Link><button>×</button></div>)}</div></section></PageFrame>; }
