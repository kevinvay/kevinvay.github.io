"use client";

import { useEffect, useState, type CSSProperties } from "react";
import logoAnimation from "../logo-frames.json";

const socials = [
  ["Dribbble", "https://dribbble.com/kevin-vay", "/figma-assets/dribbble.svg"],
  ["Instagram", "https://www.instagram.com/kevin.vay/", "/figma-assets/instagram.svg"],
  ["Facebook", "https://www.facebook.com/kevin.vay217", "/figma-assets/facebook.svg"],
  ["LinkedIn", "https://www.linkedin.com/in/kevin-vay/details/experience/", "/figma-assets/linkedin.svg"],
];

export function SiteLoader() {
  return (
    <div className="site-loader" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} style={{ "--loader-index": index } as CSSProperties} />
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [hovering, setHovering] = useState(false);
  const [frame, setFrame] = useState(logoAnimation.frames.length - 1);

  useEffect(() => {
    logoAnimation.frames.forEach((src) => { const image = new Image(); image.src = src; });
  }, []);

  useEffect(() => {
    const last = logoAnimation.frames.length - 1;
    if (!hovering) { setFrame(last); return; }
    let current = 0;
    setFrame(current);
    const timer = window.setInterval(() => {
      current += 1;
      setFrame(Math.min(current, last));
      if (current >= last) window.clearInterval(timer);
    }, logoAnimation.frameDurationMs);
    return () => window.clearInterval(timer);
  }, [hovering]);

  return (
    <header className="site-header">
      <a
        className="brand"
        href="/"
        aria-label="Kevin Wu home"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <span className="brand-logo" aria-hidden="true"><img src={logoAnimation.frames[frame]} alt="" /></span>
        <span className="brand-copy"><b>Kevin Wu</b><span className="brand-comma">,</span><em>a creative designer</em></span>
      </a>
      <a className="connect-button" href="/contact">
        <span className="connect-arrow">→</span><span className="connect-label">Let&apos;s connect</span>
      </a>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <span>Copyright ⓒ 2026 K-STUDIO.</span>
      <nav aria-label="Social links">
        {socials.map(([label, href, icon]) => (
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} key={label}><img src={icon} alt="" /></a>
        ))}
      </nav>
    </footer>
  );
}

export function PortfolioNav({ active = "home" }: { active?: "home" | "works" | "about" | "contact" | null }) {
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const update = () => setDocked(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nav = (
    <nav className="floating-nav" aria-label="Portfolio navigation">
        <a className={`home-link ${active === "home" ? "is-active" : ""}`} href="/">Home <span>/</span></a>
        <div className="nav-menu">
          <a className={active === "works" ? "is-active" : ""} href="/works">Works</a>
          <a className={active === "about" ? "is-active" : ""} href="/about">About</a>
          <a className={active === "contact" ? "is-active" : ""} href="/contact">Contact</a>
        </div>
    </nav>
  );

  return (
    <div className={`floating-nav-shell${docked ? " is-docked" : ""}`}>
      {nav}
    </div>
  );
}
