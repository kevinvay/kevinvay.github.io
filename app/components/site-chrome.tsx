"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  DEFAULT_GLASS_BORDER_CONFIG,
  DEFAULT_LIQUID_GLASS_CONFIG,
  DEFAULT_MENU_GLASS_BORDER_CONFIG,
  LiquidGlass,
  LiquidGlassControls,
} from "./liquid-glass";
import { LogoMark } from "./logo-mark";
import { OptimizedImage } from "./optimized-image";

const LOGO_FRAME_COUNT = 9;
const LOGO_FRAME_DURATION_MS = 85;

const socials = [
  ["Dribbble", "https://dribbble.com/kevin-vay", "/figma-assets/dribbble.svg"],
  ["Instagram", "https://www.instagram.com/hello_kevinwu/", "/figma-assets/instagram.svg"],
  ["Facebook", "https://www.facebook.com/kevin.vay217", "/figma-assets/facebook.svg"],
  ["LinkedIn", "https://www.linkedin.com/in/kevin-vay/details/experience/", "/figma-assets/linkedin.svg"],
];

type GlassRenderingMode = "fallback" | "svg";

function supportsSvgBackdropRefraction() {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  const isFirefox = /Firefox|FxiOS/.test(userAgent);
  const isChromium = /Chrome|Chromium|Edg|OPR|SamsungBrowser/.test(userAgent);

  return !isIOS
    && !isFirefox
    && isChromium
    && window.CSS.supports("backdrop-filter", "url(#liquid-glass-support-test)");
}

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
  const [frame, setFrame] = useState(LOGO_FRAME_COUNT - 1);

  useEffect(() => {
    const last = LOGO_FRAME_COUNT - 1;
    if (!hovering) { setFrame(last); return; }
    let current = 0;
    setFrame(current);
    const timer = window.setInterval(() => {
      current += 1;
      setFrame(Math.min(current, last));
      if (current >= last) window.clearInterval(timer);
    }, LOGO_FRAME_DURATION_MS);
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
        <span className="brand-logo" aria-hidden="true"><LogoMark frame={frame} /></span>
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
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} key={label}><OptimizedImage src={icon} alt="" /></a>
        ))}
      </nav>
    </footer>
  );
}

export function PortfolioNav({
  active = "home",
  liquidGlass = true,
  glassControls = false,
}: {
  active?: "home" | "works" | "about" | "contact" | null;
  liquidGlass?: boolean;
  glassControls?: boolean;
}) {
  const [docked, setDocked] = useState(false);
  const [glassMode, setGlassMode] = useState<GlassRenderingMode>("fallback");
  const [glassConfig, setGlassConfig] = useState({ ...DEFAULT_LIQUID_GLASS_CONFIG });
  const [glassRevision, setGlassRevision] = useState(0);

  useEffect(() => {
    if (!liquidGlass) return;
    setGlassMode(supportsSvgBackdropRefraction() ? "svg" : "fallback");
  }, [liquidGlass]);

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

  const navStyle = liquidGlass ? {
    "--glass-tint-opacity": glassConfig.tintOpacity,
    "--glass-tint-soft": glassConfig.tintOpacity * 0.36,
    "--glass-menu-opacity": Math.min(0.7, glassConfig.tintOpacity + 0.02),
    "--glass-border-width": `${DEFAULT_GLASS_BORDER_CONFIG.borderWidth}px`,
    "--glass-border-base-opacity": DEFAULT_GLASS_BORDER_CONFIG.baseOpacity,
    "--glass-border-highlight-opacity": DEFAULT_GLASS_BORDER_CONFIG.highlightOpacity,
    "--glass-border-highlight-x": `${DEFAULT_GLASS_BORDER_CONFIG.highlightX}%`,
    "--glass-border-highlight-y": `${DEFAULT_GLASS_BORDER_CONFIG.highlightY}%`,
    "--glass-border-lowlight-opacity": DEFAULT_GLASS_BORDER_CONFIG.lowlightOpacity,
    "--glass-border-lowlight-x": `${DEFAULT_GLASS_BORDER_CONFIG.lowlightX}%`,
    "--glass-border-lowlight-y": `${DEFAULT_GLASS_BORDER_CONFIG.lowlightY}%`,
    "--menu-border-width": `${DEFAULT_MENU_GLASS_BORDER_CONFIG.borderWidth}px`,
    "--menu-border-base-opacity": DEFAULT_MENU_GLASS_BORDER_CONFIG.baseOpacity,
    "--menu-border-highlight-opacity": DEFAULT_MENU_GLASS_BORDER_CONFIG.highlightOpacity,
    "--menu-border-highlight-x": `${DEFAULT_MENU_GLASS_BORDER_CONFIG.highlightX}%`,
    "--menu-border-highlight-y": `${DEFAULT_MENU_GLASS_BORDER_CONFIG.highlightY}%`,
    "--menu-border-lowlight-opacity": DEFAULT_MENU_GLASS_BORDER_CONFIG.lowlightOpacity,
    "--menu-border-lowlight-x": `${DEFAULT_MENU_GLASS_BORDER_CONFIG.lowlightX}%`,
    "--menu-border-lowlight-y": `${DEFAULT_MENU_GLASS_BORDER_CONFIG.lowlightY}%`,
  } as CSSProperties : undefined;

  const nav = (
    <nav
      className={`floating-nav${liquidGlass ? ` has-liquid-glass glass-${glassMode}` : ""}`}
      data-glass-mode={liquidGlass ? glassMode : undefined}
      style={navStyle}
      aria-label="Portfolio navigation"
    >
        {liquidGlass && glassMode === "svg" ? <LiquidGlass key={glassRevision} config={glassConfig} /> : null}
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
      {liquidGlass && glassControls && active === "home" ? (
        <LiquidGlassControls
          config={glassConfig}
          onChange={setGlassConfig}
          onReset={() => setGlassConfig({ ...DEFAULT_LIQUID_GLASS_CONFIG })}
          onRebuild={() => setGlassRevision((current) => current + 1)}
        />
      ) : null}
    </div>
  );
}
