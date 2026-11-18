"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isMotionStudyPath, parallaxOffset, parallaxOffsetSoft, revealDelay } from "./parallax-math.js";

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
  ".about-intro", ".stats-stack > *", ".about-patents > h2", ".patent-grid > a", ".experience-panel > *:not(.pixel-bird)",
  ".service-stage", ".contact-content > *",
  ".wechat-card", ".project-plan", ".scope-tabs",
  ".principles-section > h2",
  ".case-hero > *", ".case-text", ".case-media", ".airline-task-cards > article",
  ".mould-hero > *", ".mould-text", ".mould-system-cards > article", ".mould-rounded", ".mould-platform",
  "footer",
].join(", ");

const studyLayers = [
  { speed: 0.04, limit: 16 },
  { speed: 0.02, limit: 10 },
  { speed: -0.012, limit: 8 },
] as const;

export function ParallaxController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const study = isMotionStudyPath(pathname);

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
      element.style.setProperty("--reveal-delay", `${revealDelay(index, study ? 42 : 140, study ? 3 : 7)}ms`);
    });

    const activeLayers = study
      ? layers.map((layer, index) => ({ ...layer, ...studyLayers[index] }))
      : layers;
    const offsetFor = study ? parallaxOffsetSoft : parallaxOffset;
    const phoneMarquee = window.matchMedia("(max-width: 912px)");
    const tickerLayer = (element: HTMLElement) => activeLayers.find((layer) => element.matches(layer.selector));

    activeLayers.forEach((layer) => {
      document.querySelectorAll<HTMLElement>(layer.selector).forEach((element) => {
        if (element.closest(".home-page .hero, .works-page, .about-page .inner-hero")) return;
        if (element.matches(".ticker-back, .ticker-front") && phoneMarquee.matches) return;
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
        return [element, offsetFor(center - rect.top - rect.height / 2, layer.speed, layer.limit, multiplier)] as const;
      });
      offsets.forEach(([element, offset]) => element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`));
    };

    const releasePhoneTickers = () => {
      document.querySelectorAll<HTMLElement>(".ticker-back, .ticker-front").forEach((element) => {
        if (!phoneMarquee.matches) {
          if (items.has(element)) return;
          const layer = tickerLayer(element);
          if (!layer) return;
          items.set(element, layer);
          element.classList.add("parallax-layer");
          observer.observe(element);
          return;
        }
        active.delete(element);
        items.delete(element);
        observer.unobserve(element);
        element.classList.remove("parallax-layer");
        element.style.removeProperty("--parallax-y");
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      releasePhoneTickers();
      schedule();
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
        element.style.setProperty("--reveal-scroll-delay", `${(study ? 0 : 40) + Math.min(revealIndex, study ? 2 : 4) * (study ? 36 : 55)}ms`);
        element.classList.add("is-revealed");
        revealObserver.unobserve(element);
        revealIndex += 1;
      });
    }, { rootMargin: "0px 0px -4%", threshold: 0.01 });

    const tickerTracks = study ? Array.from(document.querySelectorAll<HTMLElement>(".ticker-track")) : [];
    const services = study ? document.querySelector(".services") : null;
    let ambientObserver: IntersectionObserver | null = null;
    if (services && tickerTracks.length) {
      const setTickerState = (state: "running" | "paused") => {
        tickerTracks.forEach((track) => { track.style.animationPlayState = state; });
      };
      setTickerState("paused");
      ambientObserver = new IntersectionObserver(([entry]) => {
        setTickerState(entry?.isIntersecting ? "running" : "paused");
      }, { threshold: 0.12 });
      ambientObserver.observe(services);
    }

    items.forEach((_, element) => observer.observe(element));
    revealTimer = window.setTimeout(() => {
      matchedHero?.classList.add("is-hero-revealed");
      revealItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const revealStartOffset = study ? 24 : 150;
        const layoutTop = rect.top - revealStartOffset;
        if (layoutTop < window.innerHeight * 0.96 && rect.bottom > 0) element.classList.add("is-revealed");
        else revealObserver.observe(element);
      });
    }, study ? 420 : 1100);
    const intro = document.querySelector<HTMLElement>(".about-page .about-intro");
    const settleIntro = (event: AnimationEvent) => {
      if (event.target !== intro) return;
      intro.classList.add("is-settled");
    };
    intro?.addEventListener("animationend", settleIntro);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    schedule();

    return () => {
      window.cancelAnimationFrame(frame);
      intro?.removeEventListener("animationend", settleIntro);
      observer.disconnect();
      revealObserver.disconnect();
      ambientObserver?.disconnect();
      tickerTracks.forEach((track) => track.style.removeProperty("animation-play-state"));
      window.clearTimeout(revealTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
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
  }, [pathname]);

  return null;
}
