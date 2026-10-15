import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";
import { notFound } from "next/navigation";
import { projects, projectImagePath } from "@/lib/projects";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);
  if (!project) notFound();

  return <PageFrame><section className="project-detail-page">
    <Link className="back-link back-icon-only project-back-link" href="/projects" aria-label="Back to projects" title="Back to projects">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
    </Link>
    <div className="project-detail-hero">
      <img src={projectImagePath(project.image)} alt={project.name} />
      <div><small>PROJECT {project.id.padStart(2, "0")}</small><h1>{project.name}</h1><p>{project.type}</p><p>{project.text}</p>
        <dl><div><dt>Location</dt><dd>{project.location}</dd></div><div><dt>Project Type</dt><dd>{project.type}</dd></div><div><dt>Year</dt><dd>2024</dd></div></dl>
      </div>
    </div>
    <div className="project-detail-copy">
      <p>{project.text} Our team worked closely with the client from initial consultation through installation, balancing character, comfort and long-term performance.</p>
      <p>Every item was selected or designed to complement the architecture and support the way the space is used. The result is a finished environment that feels considered, personal and built to last.</p>
      <h2>From idea to installation</h2>
      <div className="project-process"><div><b>01</b><span>Consultation</span><p>Understanding the space, needs and vision.</p></div><div><b>02</b><span>Design</span><p>Refining materials, layout and furniture details.</p></div><div><b>03</b><span>Craftsmanship</span><p>Making each piece with care and precision.</p></div><div><b>04</b><span>Installation</span><p>Bringing the finished room together.</p></div></div>
    </div>
  </section></PageFrame>;
}
