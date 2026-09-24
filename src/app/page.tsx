"use client";

import { useState } from "react";
import Link from "next/link";
import { PatioFooter, PatioHeader } from "@/components/PatioShell";

const images = {
  hero: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90",
  intro: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1100&q=88",
  living: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=88",
  dining: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
  outdoor: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=85",
  custom: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1100&q=88",
  craft: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=88",
  journal: [
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85",
  ],
};

const testimonials = [
  { quote: "Patio King helped us create furniture that perfectly suited our space. The attention to detail and overall experience were excellent.", name: "Client testimonial", role: "Homeowner / replace with verified review" },
  { quote: "The process felt personal from the first conversation. Every detail was considered, and the finished space feels completely our own.", name: "Client testimonial", role: "Homeowner / replace with verified review" },
  { quote: "Thoughtful design, beautiful materials and a team that listened carefully to how we wanted to live in the room.", name: "Client testimonial", role: "Client / replace with verified review" },
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const testimonial = testimonials[testimonialIndex];
  const moveTestimonial = (direction: number) => setTestimonialIndex((current) => (current + direction + testimonials.length) % testimonials.length);

  return <main className="home-page" id="top">
    <PatioHeader />

    <section className="home-hero"><div className="home-hero-copy"><p className="home-eyebrow">Patio King</p><h1>Furniture That<br /><em>Shapes Your Space.</em></h1><p>Thoughtfully crafted furniture designed to bring comfort, character and timeless beauty into the spaces you live in.</p><div className="home-actions"><Link className="home-button light" href="/shop">Explore our collection <span>→</span></Link><Link className="home-button outline" href="/appointment">Book a visit <span>→</span></Link></div></div><div className="home-scroll"><span>Scroll to explore</span><span>01 <i /></span></div></section>

    <section className="home-intro"><div className="home-intro-image" role="img" aria-label="Warm contemporary living room furnished by Patio King" /><div><p className="home-kicker">Who we are</p><h2>We Shape<br /><em>Your Home.</em></h2><p className="home-copy">At Patio King, we believe furniture is more than something you place in a room. It is part of how a space feels, functions and becomes your own.</p><p className="home-copy">We create thoughtfully designed furniture for modern living, combining quality materials, skilled craftsmanship and contemporary design to create pieces that belong naturally in your space.</p><div className="home-values-inline"><div><b>Quality craftsmanship</b><span>Made with care and considered detail.</span></div><div><b>Designed for living</b><span>Comfort that works beautifully every day.</span></div><div><b>Custom made</b><span>Shaped around your dimensions and needs.</span></div><div><b>Personal service</b><span>A direct, consultative experience.</span></div></div></div></section>

    <section className="home-experience"><div className="home-section-heading"><div><p className="home-kicker">The Patio King experience</p><h2>From Idea to<br /><em>Living Space.</em></h2></div><p>Furniture, custom pieces and considered environments for the way modern life is lived.</p></div><div className="home-service-grid"><article className="home-service"><b>01</b><h3>Furniture</h3><p>Thoughtfully designed furniture for contemporary homes and spaces.</p></article><article className="home-service"><b>02</b><h3>Custom furniture</h3><p>Furniture designed around your dimensions, style and requirements.</p></article><article className="home-service"><b>03</b><h3>Interior & outdoor spaces</h3><p>Solutions that complement the character and function of your space.</p></article><article className="home-service"><b>04</b><h3>Projects</h3><p>Furniture and design solutions for residential and commercial environments.</p></article></div></section>

    <section className="home-spaces"><div className="home-section-heading"><div><p className="home-kicker">Designed for every space</p><h2>Made for the<br />Spaces That Matter.</h2></div><p>Pieces that bring a sense of ease, warmth and intention to the places where life happens.</p></div><div className="home-space-grid"><Link className="home-space" href="/projects/1"><div><h3>Living spaces</h3><span>Explore the room →</span></div></Link><Link className="home-space" href="/projects/2"><div><h3>Dining spaces</h3><span>Explore the room →</span></div></Link><Link className="home-space" href="/projects/3"><div><h3>Outdoor living</h3><span>Explore the room →</span></div></Link><Link className="home-space" href="/customize"><div><h3>Custom spaces</h3><span>Make it yours →</span></div></Link></div></section>

    <section className="home-craft"><div className="home-craft-image" role="img" aria-label="Natural materials in a refined interior" /><div className="home-craft-copy"><p className="home-kicker">Crafted with purpose</p><h2>Designed to Last.<br /><em>Made to Belong.</em></h2><p className="home-copy">Every Patio King piece begins with thoughtful design and attention to detail. From material selection to finishing, every element is considered to create furniture that feels as good as it looks.</p><div className="home-value-list"><article><b>01</b><div><h3>Quality materials</h3><p>Selected materials and finishes designed for everyday use and long-term durability.</p></div></article><article><b>02</b><div><h3>Attention to detail</h3><p>Carefully considered construction, proportions and finishing.</p></div></article><article><b>03</b><div><h3>Timeless design</h3><p>Contemporary forms designed to remain relevant beyond trends.</p></div></article></div></div></section>

    <section className="home-custom"><div className="home-custom-copy"><p className="home-kicker">Made for you</p><h2>Your Space.<br />Your Dimensions.<br /><em>Your Furniture.</em></h2><p className="home-copy">Not every space follows a standard size. Our customization experience allows you to create furniture around the way you live, the dimensions of your space and the style you love.</p><div className="home-process"><span>01<br /><b>CHOOSE</b></span><span>02<br /><b>CUSTOMIZE</b></span><span>03<br /><b>CRAFT</b></span><span>04<br /><b>ENJOY</b></span></div><Link className="home-button light" href="/customize">Create your custom piece <span>→</span></Link></div></section>

    <section className="home-projects"><div className="home-section-heading"><div><p className="home-kicker">Our projects</p><h2>Furniture in<br /><em>Real Spaces.</em></h2></div><p>Explore spaces where thoughtful design, craftsmanship and functionality come together.</p></div><div className="home-project-grid"><Link className="home-project" href="/projects/1"><div className="home-project-image"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=88" alt="Modern residence interior" /></div><small>Modern residence</small><h3>Modern Residence</h3><span>Residential</span><b className="home-project-link">View project →</b></Link><Link className="home-project" href="/projects/2"><div className="home-project-image"><img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=88" alt="Contemporary home interior" /></div><small>Contemporary home</small><h3>Contemporary Home</h3><span>Residential</span><b className="home-project-link">View project →</b></Link><Link className="home-project" href="/projects/3"><div className="home-project-image"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=88" alt="Outdoor living space" /></div><small>Outdoor living</small><h3>Outdoor Living</h3><span>Residential / Hospitality</span><b className="home-project-link">View project →</b></Link></div><div style={{ textAlign: "center", marginTop: 55 }}><Link className="home-project-link" href="/projects">View all projects →</Link></div></section>

    <section className="home-values"><div className="home-section-heading"><div><p className="home-kicker">Our difference</p><h2>Why Patio King?</h2></div></div><div className="home-value-columns"><article><b>01</b><h3>Design-led</h3><p>Furniture created with a strong focus on aesthetics and functionality.</p></article><article><b>02</b><h3>Custom approach</h3><p>Solutions can be adapted to your space and requirements.</p></article><article><b>03</b><h3>Quality focused</h3><p>Attention to materials, construction and finishing.</p></article><article><b>04</b><h3>Personal service</h3><p>A more direct and consultative furniture experience.</p></article></div></section>

    <section className="home-testimonials" onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) moveTestimonial(distance > 0 ? -1 : 1); setTouchStart(null); }}><p className="home-kicker">What our clients say</p><h2>Spaces That Speak<br /><em>for Themselves.</em></h2><div className="testimonial-shell"><div className="testimonial-card"><div className="testimonial-stars">★★★★★</div><blockquote>“{testimonial.quote}”</blockquote><cite>{testimonial.name} · {testimonial.role}</cite></div><div className="testimonial-controls"><button type="button" onClick={() => moveTestimonial(-1)} aria-label="Previous testimonial">←</button><span>0{testimonialIndex + 1} / 0{testimonials.length}</span><button type="button" onClick={() => moveTestimonial(1)} aria-label="Next testimonial">→</button></div></div></section>

    <section className="home-trust"><h2>Designed for Homes.<br /><em>Chosen for Living.</em></h2><div className="home-trust-list"><span>Custom projects</span><span>Quality materials</span><span>Custom design</span><span>Personal consultation</span></div></section>

    <section className="home-journal"><div className="home-journal-heading"><div><p className="home-kicker">Follow Patio King</p><h2>A Look Into<br /><em>Our World.</em></h2></div><Link className="home-project-link" href="/contact">Follow our visual journal →</Link></div><div className="home-journal-grid">{images.journal.map((image, index) => <Link href="/contact" key={image}><img src={image} alt={`Patio King visual journal image ${index + 1}`} /></Link>)}</div></section>

    <section className="home-final"><div><p className="home-kicker">Begin with your space</p><h2>Your Space Deserves Something Distinct.</h2><p>Let&apos;s create furniture that fits the way you live.</p><div className="home-actions"><Link className="home-button light" href="/appointment">Book a visit <span>→</span></Link><Link className="home-button outline" href="/customize">Start a custom project <span>→</span></Link></div></div></section>

    <PatioFooter />
  </main>;
}
