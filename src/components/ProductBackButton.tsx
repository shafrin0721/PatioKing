import Link from "next/link";

export function ProductBackButton() {
  return <Link className="back-link back-icon-only product-back-link" href="/shop" aria-label="Back to shop" title="Back to shop">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
  </Link>;
}
