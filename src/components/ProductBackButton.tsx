"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function ProductBackButton() {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/shop");
    }
  };

  return <Link className="back-link back-icon-only" href="/shop" onClick={handleClick} aria-label="Back" title="Back to previous page">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
  </Link>;
}
