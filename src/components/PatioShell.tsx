"use client";

import { useState } from "react";
import Link from "next/link";

export function PatioHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="reference-header"><Link className="brand-mark" href="/" onClick={closeMenu}><strong>PK</strong><small>PATIO KING</small></Link><button className={`mobile-menu-toggle ${menuOpen ? "open" : ""}`} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button><nav className={menuOpen ? "open" : ""}><Link href="/" onClick={closeMenu}>Home</Link><Link href="/products" onClick={closeMenu}>Products</Link><Link href="/customize" onClick={closeMenu}>Customize</Link><Link href="/appointment" onClick={closeMenu}>Book a Visit</Link><Link href="/projects" onClick={closeMenu}>Projects</Link><Link href="/about" onClick={closeMenu}>About</Link><Link href="/contact" onClick={closeMenu}>Contact</Link></nav><div className="head-icons"><Link className="header-icon profile-icon" href="/profile" aria-label="Profile" title="Profile">♙</Link><Link className="header-icon" href="/wishlist" aria-label="Wishlist" title="Wishlist">♡</Link><Link className="cart-count" href="/cart" aria-label="Shopping cart" title="Shopping cart">Bag <span>0</span></Link></div></header>;
}

export function PatioFooter() {
  return <footer className="reference-footer"><div className="footer-top"><div><div className="footer-brand">P a t i o  K i n g</div><p>“We Shape Your Home.” Modern furniture<br />solutions for the discerning lifestyle.</p><div className="socials">◎　f　℘</div></div><div><small>Navigation</small><p>Collection<br />Spaces<br />About<br />Process<br />Projects</p></div><div><small>Contact</small><p>• patiokinginfo@gmail.com<br />• +94 77 342 4994<br />• Sri Lanka</p></div><div><small>Service</small><p>• Bespoke Design<br />• Site Consultation<br />• After-Sales<br />• Sustainability</p></div></div><div className="footer-statement">PATIO KING <i>•</i><br />WE SHAPE<br />YOUR HOME <i>•</i><small>© 2024 Patio King. All Rights Reserved.</small></div></footer>;
}

export function PageFrame({ children }: { children: React.ReactNode }) { return <main className="reference-site"><PatioHeader />{children}<PatioFooter /></main>; }
