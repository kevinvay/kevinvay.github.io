import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "../components/site-chrome";
import { FrameAnimation } from "../components/frame-animation";
import { projects } from "../projects";

export default function WorksPage() {
  return (
    <main className="inner-page works-page">
      <SiteLoader />
      <SiteHeader />
      <section className="inner-hero">
        <div className="inner-hero-copy">
          <h1><span>MY <span className="title-media title-media-b"><img src="/figma-assets/inner/title-b.png" alt="B" /></span>EST</span><span>PORTFOLIO.</span></h1>
          <p>Purpose driven, strategy-led<br /><span>that people care about ↓<i aria-hidden="true" /></span></p>
        </div>
        <FrameAnimation name="works" />
      </section>
      <section className="project-directory" aria-label="Portfolio projects">
        <div className="project-grid">
          {projects.map((project) => (
            <a
              className={`directory-card${project.wide ? " wide" : ""}`}
              href={`/works/${project.slug}`}
              key={project.slug}
              aria-label={`View project: ${project.title}`}
            >
              {project.slug === "mould-ui" ? (
                <picture>
                  <source media="(max-width: 912px)" srcSet="/figma-assets/work-mould-mobile-square.png" />
                  <img src={project.coverImage} alt="" />
                </picture>
              ) : (
                <img src={project.coverImage} alt="" />
              )}
              <div><p>{project.description}</p><h2>{project.title} <span>↗</span></h2></div>
            </a>
          ))}
        </div>
      </section>
      <SiteFooter />
      <PortfolioNav active="works" />
    </main>
  );
}
