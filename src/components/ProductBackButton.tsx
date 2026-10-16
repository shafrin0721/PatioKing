import Link from "next/link";

export function ProductBackButton() {
  return <Link className="back-link product-back-link" href="/shop">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
    Back to shop
  </Link>;
}
