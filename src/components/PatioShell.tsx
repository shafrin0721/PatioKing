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
  return <footer className="reference-footer"><div className="footer-top"><div><img className="footer-logo" src="/assets/logo.jpeg" alt="Patio King" /><p>“We Shape Your Home.” Modern furniture<br />solutions for the discerning lifestyle.</p><div className="socials" aria-label="Patio King social links"><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1Z" /></svg></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" className="social-icon-fill" /></svg></a><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer" aria-label="Pinterest"><svg viewBox="0 0 24 24"><path d="M12 3a8.5 8.5 0 0 0-3.1 16.4c-.1-1.4 0-3 .4-4.3l1.1-4.7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.8 1.5 1.7 0 1-.6 2.4-.9 3.8-.3 1.1.6 2 1.7 2 2.1 0 3.7-2.2 3.7-5.3 0-2.8-2-4.8-5-4.8-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2 .8 2.5.1.1.1.2.1.4l-.3 1.1c-.1.4-.4.5-.8.3-1.5-.7-2.4-2.8-2.4-4.5C5.2 8.4 8 4.3 13 4.3c4.1 0 6.8 3 6.8 6.2 0 4.2-2.4 7.3-5.8 7.3-1.1 0-2.2-.6-2.6-1.3l-.7 2.7c-.3 1.3-1.1 2.9-1.6 3.9A8.5 8.5 0 1 0 12 3Z" /></svg></a><a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="m21.7 3.3-3.2 16.1c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.3 13.2l-4.7-1.5c-1-.3-1-1 .2-1.5L20.2 3c.9-.3 1.7.2 1.5.3Z" /></svg></a></div></div><div><small>Navigation</small><p>Collection<br />Spaces<br />About<br />Process<br />Projects</p></div><div><small>Contact</small><p>• patiokinginfo@gmail.com<br />• +94 77 342 4994<br />• Sri Lanka</p></div><div><small>Service</small><p>• Bespoke Design<br />• Site Consultation<br />• After-Sales<br />• Sustainability</p></div></div><div className="footer-statement">PATIO KING <i>•</i><br />WE SHAPE<br />YOUR HOME <i>•</i><small>© 2024 Patio King. All Rights Reserved.</small></div></footer>;
}

export function PageFrame({ children }: { children: React.ReactNode }) { return <main className="reference-site"><PatioHeader />{children}<PatioFooter /></main>; }
