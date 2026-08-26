"use client";

import { useEffect } from "react";
import { parallaxOffset, revealDelay } from "./parallax-math.js";

const layers = [
  {
    selector: ".hero-animation, .inner-frame-media, .ticker-back, .contact-line",
    speed: 0.14,
    limit: 88,
  },
  {
    selector: ".about-story > img, .service-stage, .wechat-card, .case-hero-image, .mould-hero-image, .case-media, .mould-rounded, .mould-platform",
    speed: 0.065,
    limit: 44,
  },
  {
    selector: ".hero-content h1, .inner-hero-copy h1, .ticker-front, .contact-content, .principles-section > h2, .case-text, .mould-text",
    speed: -0.04,
    limit: 30,
  },
] as const;

type Layer = { speed: number; limit: number };

const revealSelector = [
  ".site-header",
  ".hero-content > *", ".hero-animation",
  ".inner-hero-copy > *", ".inner-frame-media",
  ".works-content > h2", ".work-card", ".directory-card",
  ".about-intro", ".stats-stack > *", ".experience-panel > *:not(.pixel-bird)",
  ".service-stage", ".contact-content > *",
  ".wechat-card", ".project-plan",
  ".principles-section > h2",
  ".case-hero > *", ".case-text", ".case-media", ".airline-task-cards > article",
  ".mould-hero > *", ".mould-text", ".mould-system-cards > article", ".mould-rounded", ".mould-platform",
  "footer",
].join(", ");

export function ParallaxController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = new Map<HTMLElement, Layer>();
    const active = new Set<HTMLElement>();
    const matchedHero = document.querySelector<HTMLElement>(
      ".home-page > .hero, .works-page > .inner-hero, .about-page > .inner-hero",
    );
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(revealSelector)).filter(
      (element) => !element.closest(".home-page .hero, .works-page .inner-hero, .about-page .inner-hero"),
    );
    let frame = 0;
    let revealTimer = 0;

    document.documentElement.classList.add("motion-ready");
    const revealGroups = new Map<Element, HTMLElement[]>();
    revealItems.forEach((element) => {
      const group = element.closest("section, header, footer") ?? document.body;
      revealGroups.set(group, [...(revealGroups.get(group) ?? []), element]);
    });
    revealItems.forEach((element) => {
      const group = element.closest("section, header, footer") ?? document.body;
      const index = element.matches(".site-header") ? 0 : Math.max(0, revealGroups.get(group)?.indexOf(element) ?? 0) + 1;
      element.classList.add("reveal-layer");
      element.style.setProperty("--reveal-delay", `${revealDelay(index, 140, 7)}ms`);
    });

    layers.forEach((layer) => {
      document.querySelectorAll<HTMLElement>(layer.selector).forEach((element) => {
        if (element.closest(".home-page .hero, .works-page, .about-page .inner-hero")) return;
        if (items.has(element)) return;
        items.set(element, layer);
        element.classList.add("parallax-layer");
      });
    });

    const update = () => {
      frame = 0;
      const center = window.innerHeight / 2;
      const multiplier = window.innerWidth < 700 ? 0.65 : 1;
      const offsets = Array.from(active, (element) => {
        const rect = element.getBoundingClientRect();
        const layer = items.get(element)!;
        return [element, parallaxOffset(center - rect.top - rect.height / 2, layer.speed, layer.limit, multiplier)] as const;
      });
      offsets.forEach(([element, offset]) => element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? active.add(entry.target as HTMLElement) : active.delete(entry.target as HTMLElement));
      schedule();
    }, { rootMargin: "30% 0px" });

    const revealObserver = new IntersectionObserver((entries) => {
      let revealIndex = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add("is-scroll-reveal");
        element.style.setProperty("--reveal-scroll-delay", `${40 + Math.min(revealIndex, 4) * 55}ms`);
        element.classList.add("is-revealed");
        revealObserver.unobserve(element);
        revealIndex += 1;
      });
    }, { rootMargin: "0px 0px -4%", threshold: 0.01 });

    items.forEach((_, element) => observer.observe(element));
    revealTimer = window.setTimeout(() => {
      matchedHero?.classList.add("is-hero-revealed");
      revealItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const revealStartOffset = 150;
        const layoutTop = rect.top - revealStartOffset;
        if (layoutTop < window.innerHeight * 0.96 && rect.bottom > 0) element.classList.add("is-revealed");
        else revealObserver.observe(element);
      });
    }, 1100);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      revealObserver.disconnect();
      window.clearTimeout(revealTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      matchedHero?.classList.remove("is-hero-revealed");
      items.forEach((_, element) => {
        element.classList.remove("parallax-layer");
        element.style.removeProperty("--parallax-y");
      });
      revealItems.forEach((element) => {
        element.classList.remove("reveal-layer", "is-revealed", "is-scroll-reveal");
        element.style.removeProperty("--reveal-delay");
        element.style.removeProperty("--reveal-scroll-delay");
      });
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
