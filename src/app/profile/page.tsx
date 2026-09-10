import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";

export default function ProfilePage() { return <PageFrame><section className="account-page"><small>YOUR PATIO KING ACCOUNT</small><h1>Welcome back.</h1><p>Sign in to view your orders, saved pieces and account details.</p><div className="account-actions"><Link className="dark-button" href="/products">Continue shopping →</Link><Link className="account-secondary" href="/wishlist">View wishlist</Link></div></section></PageFrame>; }
