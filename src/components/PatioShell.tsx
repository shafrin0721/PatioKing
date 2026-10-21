"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function PatioHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setMenuOpen(false);
  const navItems = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }, { href: "/shop", label: "Shop" }, { href: "/customize", label: "Customize" }, { href: "/appointment", label: "Book a Visit" }, { href: "/contact", label: "Contacts" }];
  return <header className="reference-header"><Link className="brand-mark" href="/" onClick={closeMenu}><img src="/assets/logo.jpeg" alt="Patio King" /></Link><button className={`mobile-menu-toggle ${menuOpen ? "open" : ""}`} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button><nav className={menuOpen ? "open" : ""}>{navItems.map((item) => <Link className={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "active" : undefined} href={item.href} onClick={closeMenu} key={item.href}>{item.label}</Link>)}</nav></header>;
}

export function PatioFooter() {
  return <footer className="reference-footer">
    <div className="footer-top">
      <div>
        <Link className="footer-logo-link" href="/" aria-label="Patio King home"><img className="footer-logo" src="/assets/logo.jpeg" alt="Patio King" /></Link>
        <p>“We Shape Your Home.” Modern furniture<br />solutions for the discerning lifestyle.</p>
        <div className="socials" aria-label="Patio King social links">
          <a href="https://www.instagram.com/patio.king/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" className="social-icon-fill" /></svg></a>
          <a href="https://wa.me/94773424994" target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.4l1.3-4.9a8.4 8.4 0 1 1 16.2-3.8Z" /><path d="M8.4 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.8 1.9c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.3 0 .6.5.9 1.3 1.6 2.2 2.1.3.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.4 0 .3-.2 1-.7 1.4-.5.5-1.2.7-2 .6-1-.2-2.3-.8-3.8-2.1-1.3-1.1-2.2-2.5-2.5-3.4-.3-.9-.1-1.7.3-2.2Z" /></svg></a>
        </div>
      </div>
      <div><small>Navigation</small><nav className="footer-link-list" aria-label="Footer navigation">
        <Link href="/">Home</Link><Link href="/shop">Collections</Link><Link href="/about">About</Link><Link href="/customize">Customize</Link><Link href="/projects">Projects</Link>
      </nav></div>
      <div><small>Contact</small><nav className="footer-link-list" aria-label="Contact links">
        <a href="mailto:patiokinginfo@gmail.com">patiokinginfo@gmail.com</a><a href="tel:+94773424994">+94 77 342 4994</a><a href="https://www.google.com/maps/search/?api=1&query=Colombo%2C%20Sri%20Lanka" target="_blank" rel="noreferrer">Colombo, Sri Lanka</a><a href="https://wa.me/94773424994" target="_blank" rel="noreferrer">WhatsApp us</a>
      </nav></div>
      <div><small>Service</small><nav className="footer-link-list" aria-label="Service links">
        <Link href="/customize">Bespoke Design</Link><Link href="/appointment">Site Consultation</Link><Link href="/contact">After-Sales</Link><Link href="/about">Sustainability</Link>
      </nav></div>
    </div>
    <div className="footer-statement">PATIO KING <i>•</i><br />WE SHAPE<br />YOUR HOME <i>•</i><small>© 2026 Patio King. All Rights Reserved.</small></div>
  </footer>;
}

export function PageFrame({ children }: { children: React.ReactNode }) { return <main className="reference-site"><PatioHeader />{children}<PatioFooter /></main>; }
