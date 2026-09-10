import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";

const projects = [
  { name: "Modern Residence", type: "Residential Furniture", location: "Beverly Hills, CA", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85", text: "A warm, contemporary living environment shaped around natural materials, thoughtful light and furniture made for everyday life." },
  { name: "Contemporary Villa", type: "Living + Kitchen", location: "Colombo, Sri Lanka", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85", text: "A calm collection of indoor and outdoor pieces that connects the home to its garden and creates an effortless flow between spaces." },
  { name: "Luxury Apartment", type: "Residential Furniture", location: "Colombo, Sri Lanka", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85", text: "Layered textures, deep timber tones and considered silhouettes create a refined apartment with a strong sense of place." },
];

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects[(Number(id) - 1 + projects.length) % projects.length];
  return <PageFrame><section className="project-detail-page"><Link className="back-link" href="/projects">← Back to Projects</Link><div className="project-detail-hero"><img src={project.image} alt={project.name} /><div><small>PROJECT 0{id}</small><h1>{project.name}</h1><p>{project.type}</p><p>{project.text}</p><dl><div><dt>Location</dt><dd>{project.location}</dd></div><div><dt>Project Type</dt><dd>{project.type}</dd></div><div><dt>Year</dt><dd>2024</dd></div></dl></div></div><div className="project-detail-copy"><p>{project.text} Our team worked closely with the client from initial consultation through installation, balancing character, comfort and long-term performance.</p><p>Every item was selected or designed to complement the architecture and support the way the space is used. The result is a finished environment that feels considered, personal and built to last.</p><h2>From idea to installation</h2><div className="project-process"><div><b>01</b><span>Consultation</span><p>Understanding the space, needs and vision.</p></div><div><b>02</b><span>Design</span><p>Refining materials, layout and furniture details.</p></div><div><b>03</b><span>Craftsmanship</span><p>Making each piece with care and precision.</p></div><div><b>04</b><span>Installation</span><p>Bringing the finished room together.</p></div></div></div></section></PageFrame>;
}
