"use client";

import { useEffect, useRef } from "react";
import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "../components/site-chrome";
import { FrameAnimation } from "../components/frame-animation";
import { projects } from "../projects";
import { OptimizedImage } from "../components/optimized-image";

export default function WorksPage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = page.querySelector<HTMLElement>(".inner-hero");
    const directory = page.querySelector<HTMLElement>(".project-directory");
    if (!hero || !directory) return;

    let frame = 0;
    const updateHeroTransition = () => {
      frame = 0;
      const heroRect = hero.getBoundingClientRect();
      const overlap = heroRect.bottom - directory.getBoundingClientRect().top;
      const transitionDistance = Math.min(window.innerHeight * 0.2, heroRect.height * 0.35);
      const progress = Math.min(1, Math.max(0, overlap / transitionDistance));
      page.style.setProperty("--works-hero-progress", progress.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeroTransition);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    updateHeroTransition();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      page.style.removeProperty("--works-hero-progress");
    };
  }, []);

  return (
    <main className="inner-page works-page" ref={pageRef}>
      <SiteLoader />
      <SiteHeader />
      <section className="inner-hero">
        <div className="inner-hero-copy">
          <h1><span>MY <span className="title-media title-media-b"><OptimizedImage src="/figma-assets/inner/title-b.webp" alt="B" loading="eager" /></span>EST</span><span>PORTFOLIO.</span></h1>
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
                  <source media="(max-width: 729px)" srcSet="/figma-assets/work-mould-mobile-square.webp" />
                  <OptimizedImage src={project.coverImage} alt="" sizes="(max-width: 729px) calc(100vw - 48px), 42vw" />
                </picture>
              ) : (
                <OptimizedImage src={project.coverImage} alt="" sizes="(max-width: 729px) calc(100vw - 48px), 42vw" />
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
