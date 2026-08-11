"use client";

import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import heroMedia from "./hero-media.json";
import contactFlip from "./contact-flip.json";
import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "./components/site-chrome";
import { homeProjects } from "./projects";

const serviceCards = [
  {
    image: "/figma-assets/service-strategy.png",
    title: "Product strategy",
    backTitle: "Strategy",
    items: [["Experience Strategy", "体验策略"], ["Creative Direction", "创意指导"], ["User Research", "用户研究"], ["Vision Discovery", "视觉探索"], ["Technology Strategy", "技术策略"]],
  },
  {
    image: "/figma-assets/service-branding.png",
    title: "Branding",
    backTitle: "Branding",
    items: [["Brand Design", "品牌设计"], ["Brand Strategy", "品牌策略"], ["Brand Identity", "品牌识别"], ["Rebranding", "品牌重塑"], ["Enterprise VI", "企业 VI"]],
  },
  {
    image: "/figma-assets/service-systems.png",
    title: "Design systems",
    backTitle: "Design Systems",
    items: [["Design Token", "设计指令"], ["UI Component", "界面组件库"], ["Style Guidelines", "样式指南"], ["Assets Guides", "组件指南"], ["System Application", "系统应用"]],
  },
  {
    image: "/figma-assets/service-product.png",
    title: "Product design",
    backTitle: "Product Design",
    items: [["Interaction Design", "交互设计"], ["Interface Design", "界面设计"], ["Prototyping", "原型设计"], ["Usability Testing", "可用性测试"], ["Design Handoff", "设计交付"]],
  },
];

function HeroAnimation() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    heroMedia.frames.forEach((src) => { const image = new Image(); image.src = src; });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % heroMedia.frames.length);
    }, heroMedia.itemDurationMs);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-animation" aria-hidden="true">
      <div className="hero-animation-stage">
        <img
          src={heroMedia.frames[frame]}
          alt=""
          key={heroMedia.frames[frame]}
          style={{ "--hero-duration": `${heroMedia.itemDurationMs}ms` } as CSSProperties}
        />
      </div>
    </div>
  );
}

function TickerItem({ direction }: { direction: "left" | "right" }) {
  return (
    <span className="ticker-item">
      <span>what can I do</span>
      <img src={`/figma-assets/ticker-arrow-${direction}.svg`} alt="" />
    </span>
  );
}

function FlipLine({ children, offset = 0 }: { children: string; offset?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let timer = 0;
    const advance = () => {
      setFrame((current) => {
        const next = (current + 1) % contactFlip.frames.length;
        timer = window.setTimeout(advance, contactFlip.frames[next].duration);
        return next;
      });
    };
    timer = window.setTimeout(advance, contactFlip.frames[0].duration);
    return () => window.clearTimeout(timer);
  }, []);

  const activeCharacters = new Set(contactFlip.frames[frame].active);
  return (
    <span className="flip-line" aria-label={children}>
      {[...children].map((character, index) => (
        <span
          className={character === " " ? "flip-space" : `flip-char${activeCharacters.has(index + offset) ? " is-flipping" : ""}`}
          key={`${character}-${index}`}
          style={{ "--i": index + offset, "--flip-stagger": `${contactFlip.staggerMs}ms` } as CSSProperties}
          aria-hidden="true"
        >
          {character === " " ? "\u00a0" : <span className="flip-glyphs" key={`${frame}-${index}`}><span>{character}</span><span>{character}</span></span>}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [serviceIndex, setServiceIndex] = useState(1);
  const [serviceMotion, setServiceMotion] = useState({ direction: "next", tick: 0 });
  const [serviceFlipped, setServiceFlipped] = useState(false);
  const serviceSwipeStart = useRef<{ x: number; y: number } | null>(null);
  const serviceSwipeHandled = useRef(false);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panel = page.querySelector<HTMLElement>(".works-panel");
    if (!panel) return;

    let frame = 0;
    const updateHeroTransition = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const overlap = viewportHeight - panel.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, overlap / (viewportHeight * 0.2)));
      page.style.setProperty("--home-hero-progress", progress.toFixed(3));
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
      page.style.removeProperty("--home-hero-progress");
    };
  }, []);

  const changeService = (nextIndex: number, direction: "previous" | "next") => {
    setServiceFlipped(false);
    setServiceIndex(nextIndex);
    setServiceMotion(({ tick }) => ({ direction, tick: tick + 1 }));
  };

  const startServiceSwipe = (event: TouchEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 1000px)").matches) return;
    const touch = event.touches[0];
    serviceSwipeStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const endServiceSwipe = (event: TouchEvent<HTMLDivElement>) => {
    const start = serviceSwipeStart.current;
    const touch = event.changedTouches[0];
    serviceSwipeStart.current = null;
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    serviceSwipeHandled.current = true;
    window.setTimeout(() => { serviceSwipeHandled.current = false; }, 400);
    if (deltaX < 0) {
      changeService((serviceIndex + 1) % serviceCards.length, "next");
    } else {
      changeService((serviceIndex + serviceCards.length - 1) % serviceCards.length, "previous");
    }
  };

  return (
    <main className="home-page" ref={pageRef}>
      <SiteLoader />

      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-content">
          <h1 aria-label="Ideas, craft and creativity.">
            <span className="hero-line first-line">
              <span>ID</span>
              <span className="hero-e" aria-hidden="true">
                <img src="/figma-assets/hero-e.png" alt="" />
              </span>
              <span>AS, CRAFT</span>
            </span>
            <span className="hero-line">&amp; CREATIVITY.</span>
          </h1>
          <p>
            <span>Focusing on brand building</span>
            <span>and user interface design ↓ <i aria-hidden="true" /></span>
          </p>
        </div>
        <HeroAnimation />
      </section>

      <section className="works-panel" id="works" aria-labelledby="works-title">
        <div className="works-content">
          <h2 id="works-title">
            <span>Selected</span><span>works 🧩</span>
          </h2>
          <div className="work-grid">
            {homeProjects.map((work, index) => (
              <a
                className={`work-card work-card-${index + 1}`}
                href={`/works/${work.slug}`}
                key={work.slug}
                aria-label={`View project: ${work.title}`}
              >
                {index === 2 ? (
                  <picture>
                    <source media="(max-width: 912px)" srcSet="/figma-assets/work-mould-mobile-square.png" />
                    <img src={work.coverImage} alt="" />
                  </picture>
                ) : (
                  <img src={work.coverImage} alt="" />
                )}
                <div className="work-copy">
                  <p>{work.description}</p>
                  <h3>{work.title}<span aria-hidden="true">↗</span></h3>
                </div>
              </a>
            ))}
          </div>
          <a
            className="more-button"
            href="/works"
            onAnimationEnd={({ currentTarget }) => currentTarget.classList.remove("is-elastic", "is-elastic-out")}
            onBlur={({ currentTarget }) => currentTarget.classList.add("is-elastic-out")}
            onFocus={({ currentTarget }) => currentTarget.classList.add("is-elastic")}
            onPointerEnter={({ currentTarget }) => {
              currentTarget.classList.remove("is-elastic-out");
              currentTarget.classList.add("is-elastic");
            }}
            onPointerLeave={({ currentTarget }) => {
              currentTarget.classList.remove("is-elastic");
              currentTarget.classList.add("is-elastic-out");
            }}
          >
            See More
          </a>
        </div>
      </section>

      <section className="services" id="about" aria-label="What can I do">
        <div className="ticker ticker-back" aria-hidden="true">
          <div className="ticker-track">
            {Array.from({ length: 8 }, (_, index) => <TickerItem direction="right" key={index} />)}
          </div>
        </div>
        <div className="ticker ticker-front" aria-hidden="true">
          <div className="ticker-track reverse">
            {Array.from({ length: 8 }, (_, index) => <TickerItem direction="left" key={index} />)}
          </div>
        </div>
        <div className="service-stage">
          <button
            className="carousel-arrow previous"
            aria-label="Previous service"
            onClick={() => changeService((serviceIndex + serviceCards.length - 1) % serviceCards.length, "previous")}
          ><img src="/figma-assets/carousel-arrow-left.svg" alt="" /></button>
          <div
            className={`service-cards slide-${serviceMotion.direction}`}
            key={serviceMotion.tick}
            onTouchCancel={() => { serviceSwipeStart.current = null; }}
            onTouchEnd={endServiceSwipe}
            onTouchStart={startServiceSwipe}
          >
            {[-1, 0, 1].map((offset) => {
              const cardIndex = (serviceIndex + offset + serviceCards.length) % serviceCards.length;
              const card = serviceCards[cardIndex];
              return (
                <button
                  className={`service-card ${offset === 0 ? `active${serviceFlipped ? " is-flipped" : ""}` : `side-card ${offset < 0 ? "side-previous" : "side-next"}`}`}
                  key={card.title}
                  tabIndex={offset === 0 ? 0 : -1}
                  aria-hidden={offset !== 0}
                  aria-pressed={offset === 0 ? serviceFlipped : undefined}
                  aria-label={offset === 0 ? `${card.title}: reveal details` : undefined}
                  onClick={offset === 0 ? () => {
                    if (serviceSwipeHandled.current) {
                      serviceSwipeHandled.current = false;
                      return;
                    }
                    setServiceFlipped((flipped) => !flipped);
                  } : undefined}
                >
                  <span className="service-card-inner">
                    <span className="service-card-face service-card-front">
                      <span className="service-card-art"><img src={card.image} alt="" /></span>
                      <span className="service-front-divider" aria-hidden="true" />
                      <span className="service-front-title">{card.backTitle}<span aria-hidden="true">↗</span></span>
                    </span>
                    <span className="service-card-face service-card-back">
                      <span className="service-card-heading"><strong>{card.backTitle}</strong><img src="/figma-assets/service-back-symbol.svg" alt="" aria-hidden="true" /></span>
                      <img className="service-ink-divider" src="/figma-assets/service-back-ink.png" alt="" aria-hidden="true" />
                      <span className="service-card-list">
                        {card.items.map(([label, translation]) => (
                          <span className="service-card-row" key={label}><span>{label}</span><span>{translation}</span></span>
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="service-dots" aria-label="Choose a service">
            {serviceCards.map((card, index) => (
              <button
                className={index === serviceIndex ? "is-active" : ""}
                key={card.title}
                aria-label={`Show ${card.title}`}
                aria-pressed={index === serviceIndex}
                onClick={() => changeService(index, index > serviceIndex ? "next" : "previous")}
              />
            ))}
          </div>
          <button
            className="carousel-arrow next"
            aria-label="Next service"
            onClick={() => changeService((serviceIndex + 1) % serviceCards.length, "next")}
          ><img src="/figma-assets/carousel-arrow-right.svg" alt="" /></button>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <img className="contact-line" src="/figma-assets/contact-line.svg" alt="" aria-hidden="true" />
        <div className="contact-content">
          <p>Are you ready?</p>
          <h2 id="contact-title">
            <FlipLine>Let&apos;s talk about</FlipLine>
            <FlipLine offset={17}>your product.</FlipLine>
          </h2>
          <a className="contact-button" href="mailto:hello@kevinwu.design">
            <span>Contact me</span><i aria-hidden="true">→</i>
          </a>
        </div>
      </section>

      <SiteFooter />
      <PortfolioNav />
    </main>
  );
}
