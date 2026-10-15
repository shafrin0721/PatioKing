import Link from "next/link";
import { PageFrame } from "@/components/PatioShell";
import { projects, projectImagePath } from "@/lib/projects";

export default function ProjectsPage() {
  return <PageFrame>
    <section className="inner-hero project-hero">
      <small>OUR PROJECTS</small>
      <h1>Spaces Crafted With<br /><em>Purpose</em></h1>
      <p>Explore our furniture projects and discover how thoughtful design and craftsmanship transform everyday spaces.</p>
    </section>
    <section className="projects-grid">
      {projects.map((project) => <Link href={`/projects/${project.id}`} className="project-card-link" key={project.id}>
        <article>
          <div className="project-card-image">
            <img src={projectImagePath(project.image)} alt={project.name} loading="lazy" />
            <small>PROJECT {project.id.padStart(2, "0")}</small>
          </div>
          <h2>{project.name}</h2>
          <p>{project.type}</p>
          <span>View project <span aria-hidden="true">→</span></span>
        </article>
      </Link>)}
    </section>
    <section className="process-band">
      <small>OUR PROCESS</small><h2>From Idea to Installation</h2>
      <div><b>01<br /><span>Consultation</span></b><b>02<br /><span>Design</span></b><b>03<br /><span>Craftsmanship</span></b><b>04<br /><span>Installation</span></b></div>
    </section>
  </PageFrame>;
}
