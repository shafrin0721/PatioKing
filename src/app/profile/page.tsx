import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";

export default function ProfilePage() { return <PageFrame><section className="account-page"><small>YOUR PATIO KING ACCOUNT</small><h1>Welcome back.</h1><p>Explore the collection, customize a piece and contact our studio directly for an inquiry.</p><div className="account-actions"><Link className="dark-button" href="/shop">Explore the catalogue <span>→</span></Link><Link className="account-secondary" href="/contact">Contact the studio</Link></div></section></PageFrame>; }
