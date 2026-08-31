"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { motion, useMotionValue, useTransform, type MotionValue, type PanInfo } from "motion/react";
import heroMedia from "./hero-media.json";
import contactFlip from "./contact-flip.json";
import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "./components/site-chrome";
import { OptimizedImage } from "./components/optimized-image";
import { TextIcon } from "./components/text-icon";
import { homeProjects } from "./projects";

const HALF_COVER_SIZES = "(max-width: 729px) calc(100vw - 48px), 42vw";
const HOME_WIDE_COVER_SIZES = "(min-width: 1788px) 1660px, (min-width: 730px) calc(100vw - 128px), calc(100vw - 48px)";

const serviceCards = [
  {
    image: "/figma-assets/service-strategy.webp",
    title: "Product strategy",
    backTitle: "Strategy",
    items: [["Experience Strategy", "体验策略"], ["Creative Direction", "创意指导"], ["User Research", "用户研究"], ["Vision Discovery", "视觉探索"], ["Technology Strategy", "技术策略"]],
  },
  {
    image: "/figma-assets/service-branding.webp",
    title: "Branding",
    backTitle: "Branding",
    items: [["Brand Design", "品牌设计"], ["Brand Strategy", "品牌策略"], ["Brand Identity", "品牌识别"], ["Rebranding", "品牌重塑"], ["Enterprise VI", "企业 VI"]],
  },
  {
    image: "/figma-assets/service-systems.webp",
    title: "Design systems",
    backTitle: "Design Systems",
    items: [["Design Token", "设计指令"], ["UI Component", "界面组件库"], ["Style Guidelines", "样式指南"], ["Assets Guides", "组件指南"], ["System Application", "系统应用"]],
  },
  {
    image: "/figma-assets/service-product.webp",
    title: "Product design",
    backTitle: "Product Design",
    items: [["Interaction Design", "交互设计"], ["Interface Design", "界面设计"], ["Prototyping", "原型设计"], ["Usability Testing", "可用性测试"], ["Design Handoff", "设计交付"]],
  },
];

const serviceMedia = serviceCards.map(({ image }) => image);

function ServiceMediaPreloads() {
  return (
    <>
      {serviceMedia.map((src) => (
        <link as="image" fetchPriority="low" href={src} key={src} rel="preload" />
      ))}
    </>
  );
}

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
        <OptimizedImage
          src={heroMedia.frames[frame]}
          alt=""
          loading="eager"
          fetchPriority="high"
          key={heroMedia.frames[frame]}
          style={{ "--hero-duration": `${heroMedia.itemDurationMs}ms` } as CSSProperties}
        />
      </div>
    </div>
  );
}

function TickerItem() {
  return (
    <span className="ticker-item">
      <span>what can I do</span>
      <OptimizedImage src="/figma-assets/ticker-arrow-left.svg" alt="" />
    </span>
  );
}

function ServiceCardContent({ card }: { card: (typeof serviceCards)[number] }) {
  return (
    <span className="service-card-tilt">
      <span className="service-card-inner">
        <span className="service-card-face service-card-front">
          <span className="service-card-art"><OptimizedImage src={card.image} alt="" loading="eager" /></span>
          <span className="service-front-divider" aria-hidden="true" />
          <span className="service-front-title">{card.title}<OptimizedImage src="/figma-assets/service-front-arrow.webp" alt="" aria-hidden="true" /></span>
        </span>
        <span className="service-card-face service-card-back">
          <span className="service-card-heading"><strong>{card.backTitle}</strong><OptimizedImage src="/figma-assets/service-back-symbol.svg" alt="" aria-hidden="true" /></span>
          <OptimizedImage className="service-ink-divider" src="/figma-assets/service-back-ink.webp" alt="" aria-hidden="true" />
          <span className="service-card-list">
            {card.items.map(([label, translation]) => (
              <span className="service-card-row" key={label}><span>{label}</span><span>{translation}</span></span>
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}

const MOBILE_SERVICE_GAP = 64;
const MOBILE_SERVICE_WIDTH = 480;
const MOBILE_SERVICE_STEP = MOBILE_SERVICE_WIDTH + MOBILE_SERVICE_GAP;
const MOBILE_SERVICE_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

function MobileServiceItem({ children, index, x }: { children: ReactNode; index: number; x: MotionValue<number> }) {
  const range = [-(index + 1) * MOBILE_SERVICE_STEP, -index * MOBILE_SERVICE_STEP, -(index - 1) * MOBILE_SERVICE_STEP];
  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });
  const opacity = useTransform(x, range, [0, 1, 0]);
  return <motion.div className="mobile-service-item" style={{ opacity, rotateY }}>{children}</motion.div>;
}

function MobileServiceCarousel({ initialIndex = 1 }: { initialIndex?: number }) {
  const renderedCards = useMemo(() => [...serviceCards, ...serviceCards, ...serviceCards], []);
  const middleStart = serviceCards.length;
  const initialPosition = middleStart + initialIndex;
  const [position, setPosition] = useState(initialPosition);
  const positionRef = useRef(initialPosition);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const x = useMotionValue(-(initialPosition * MOBILE_SERVICE_STEP));
  const activeIndex = ((position % serviceCards.length) + serviceCards.length) % serviceCards.length;

  const moveTo = (nextPosition: number) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  };

  const finishLoop = () => {
    const current = positionRef.current;
    const target = current >= middleStart * 2
      ? current - middleStart
      : current < middleStart
        ? current + middleStart
        : null;
    if (target === null) return;

    flushSync(() => {
      setIsJumping(true);
      moveTo(target);
    });
    x.set(-(target * MOBILE_SERVICE_STEP));
    requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)));
  };

  const endDrag = (_event: MouseEvent | TouchEvent | globalThis.PointerEvent, info: PanInfo) => {
    const direction = info.offset.x < 0 || info.velocity.x < -500 ? 1 : info.offset.x > 0 || info.velocity.x > 500 ? -1 : 0;
    if (!direction || isJumping) return;
    setFlippedIndex(null);
    moveTo(positionRef.current + direction);
  };

  return (
    <div className="mobile-service-carousel">
      <div className="mobile-service-viewport">
        <motion.div
          className="mobile-service-track"
          drag="x"
          style={{ x, gap: MOBILE_SERVICE_GAP, perspective: 1000, perspectiveOrigin: `${position * MOBILE_SERVICE_STEP + MOBILE_SERVICE_WIDTH / 2}px 50%` }}
          animate={{ x: -(position * MOBILE_SERVICE_STEP) }}
          transition={isJumping ? { duration: 0 } : MOBILE_SERVICE_SPRING}
          onAnimationComplete={finishLoop}
          onDragEnd={endDrag}
        >
          {renderedCards.map((card, index) => {
            const logicalIndex = index % serviceCards.length;
            const active = index === position;
            return (
              <MobileServiceItem index={index} key={`${card.title}-${index}`} x={x}>
                <button
                  className={`service-card mobile-service-card${active ? " active" : ""}${active && flippedIndex === logicalIndex ? " is-flipped" : ""}`}
                  aria-hidden={!active}
                  aria-label={active ? `${card.title}: reveal details` : undefined}
                  tabIndex={active ? 0 : -1}
                  onClick={() => active && setFlippedIndex((current) => current === logicalIndex ? null : logicalIndex)}
                >
                  <ServiceCardContent card={card} />
                  <span className="service-card-hit-area" aria-hidden="true" />
                </button>
              </MobileServiceItem>
            );
          })}
        </motion.div>
      </div>
      <div className="service-dots" aria-label="Choose a service">
        {serviceCards.map((card, index) => (
          <button
            className={index === activeIndex ? "is-active" : ""}
            key={card.title}
            aria-label={`Show ${card.title}`}
            aria-pressed={index === activeIndex}
            onClick={() => { setFlippedIndex(null); moveTo(middleStart + index); }}
          />
        ))}
      </div>
    </div>
  );
}

function useCompactServiceLayout() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1000px)");
    const update = () => setIsCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isCompact;
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
  const isCompactServiceLayout = useCompactServiceLayout();
  const [serviceIndex, setServiceIndex] = useState(1);
  const [serviceMotion, setServiceMotion] = useState<{ direction: "previous" | "next" | "none"; tick: number }>({ direction: "next", tick: 0 });
  const [serviceFlipped, setServiceFlipped] = useState(false);
  const serviceDragStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
    lastX: number;
    lastTime: number;
    velocityX: number;
    step: number;
    frame: number | null;
    pendingDeltaX: number;
  } | null>(null);
  const serviceSwipeHandled = useRef(false);
  const serviceTiltState = useRef<{
    card: HTMLButtonElement;
    bounds: DOMRect;
    frame: number | null;
    clientX: number;
    clientY: number;
  } | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panel = page.querySelector<HTMLElement>(".works-panel");
    const hero = page.querySelector<HTMLElement>(".hero");
    if (!panel || !hero) return;

    let frame = 0;
    const updateHeroTransition = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const heroRect = hero.getBoundingClientRect();
      const overlap = heroRect.bottom - panel.getBoundingClientRect().top;
      const transitionDistance = Math.min(viewportHeight * 0.2, heroRect.height * 0.35);
      const progress = Math.min(1, Math.max(0, overlap / transitionDistance));
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

  const changeService = (nextIndex: number, direction: "previous" | "next", animate = true) => {
    setServiceFlipped(false);
    setServiceIndex(nextIndex);
    setServiceMotion(({ tick }) => ({ direction: animate ? direction : "none", tick: tick + 1 }));
  };

  const getServiceTrackStep = (track: HTMLDivElement) => {
    const activeCard = track.querySelector<HTMLElement>(".service-card.active");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 64;
    return (activeCard?.getBoundingClientRect().width || 480) + gap;
  };

  const setServiceDragVisuals = (track: HTMLDivElement, deltaX: number, step: number) => {
    const constrainedX = Math.max(-step, Math.min(step, deltaX));
    const progress = Math.max(-1, Math.min(1, constrainedX / step));
    const depth = Math.abs(progress);
    const previousProgress = Math.max(0, progress);
    const nextProgress = Math.max(0, -progress);
    track.style.setProperty("--service-drag-x", `${constrainedX}px`);
    track.style.setProperty("--service-drag-progress", progress.toFixed(4));
    track.style.setProperty("--service-side-opacity", Math.min(1, Math.abs(progress) * 1.8).toFixed(4));
    track.style.setProperty("--service-active-rotate", `${-progress * 72}deg`);
    track.style.setProperty("--service-active-depth", `${-depth * 180}px`);
    track.style.setProperty("--service-active-scale", `${1 - depth * .06}`);
    track.style.setProperty("--service-previous-rotate", `${90 - progress * 90}deg`);
    track.style.setProperty("--service-previous-depth", `${-(1 - previousProgress) * 180}px`);
    track.style.setProperty("--service-next-rotate", `${-90 - progress * 90}deg`);
    track.style.setProperty("--service-next-depth", `${-(1 - nextProgress) * 180}px`);
    return { progress, step };
  };

  const resetServiceDragVisuals = (track: HTMLDivElement, step: number) => {
    setServiceDragVisuals(track, 0, step);
    track.style.setProperty("--service-side-opacity", "0");
  };

  const startServiceDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 1000px)").matches) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const now = performance.now();
    const step = getServiceTrackStep(event.currentTarget);
    serviceDragStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastTime: now,
      velocityX: 0,
      step,
      frame: null,
      pendingDeltaX: 0
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    resetServiceDragVisuals(event.currentTarget, step);
    event.currentTarget.classList.remove("drag-previous", "drag-next", "is-settling", "is-committing");
    event.currentTarget.classList.add("is-dragging");
  };

  const moveServiceDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = serviceDragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const now = performance.now();
    const elapsed = Math.max(1, now - start.lastTime);
    start.velocityX = ((event.clientX - start.lastX) / elapsed) * 1000;
    start.lastX = event.clientX;
    start.lastTime = now;
    start.pendingDeltaX = deltaX;
    if (start.frame !== null) return;
    const track = event.currentTarget;
    start.frame = window.requestAnimationFrame(() => {
      const activeDrag = serviceDragStart.current;
      if (!activeDrag || activeDrag.pointerId !== event.pointerId) return;
      const visualDeltaX = activeDrag.pendingDeltaX;
      track.classList.toggle("drag-next", visualDeltaX < -4);
      track.classList.toggle("drag-previous", visualDeltaX > 4);
      setServiceDragVisuals(track, visualDeltaX, activeDrag.step);
      activeDrag.frame = null;
    });
  };

  const endServiceDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = serviceDragStart.current;
    serviceDragStart.current = null;
    const track = event.currentTarget;
    if (start?.frame !== null && start?.frame !== undefined) window.cancelAnimationFrame(start.frame);
    track.classList.remove("is-dragging");
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) > 8) {
      serviceSwipeHandled.current = true;
      window.setTimeout(() => { serviceSwipeHandled.current = false; }, 400);
    }
    const velocityDirection = Math.abs(start.velocityX) >= 500 ? Math.sign(start.velocityX) : 0;
    const dragDirection = deltaX === 0 ? velocityDirection : Math.sign(deltaX);
    if (dragDirection === 0 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      track.classList.add("is-settling");
      resetServiceDragVisuals(track, start.step);
      window.setTimeout(() => track.classList.remove("is-settling", "drag-previous", "drag-next"), 360);
      return;
    }

    const direction = dragDirection < 0 ? "next" : "previous";
    const nextIndex = direction === "next"
      ? (serviceIndex + 1) % serviceCards.length
      : (serviceIndex + serviceCards.length - 1) % serviceCards.length;
    track.classList.add("is-committing");
    setServiceDragVisuals(track, direction === "next" ? -start.step : start.step, start.step);
    const enteringCard = track.querySelector<HTMLElement>(direction === "next" ? ".side-next" : ".side-previous");
    let fallbackTimer = 0;
    let commitFinished = false;
    const finishCommit = () => {
      if (commitFinished) return;
      commitFinished = true;
      window.clearTimeout(fallbackTimer);
      enteringCard?.removeEventListener("transitionend", handleCommitEnd);
      const enteringBounds = enteringCard?.getBoundingClientRect();
      const handoffCard = enteringCard?.cloneNode(true) as HTMLElement | undefined;
      if (handoffCard && enteringBounds) {
        handoffCard.className = "service-card service-card-handoff active";
        handoffCard.removeAttribute("aria-hidden");
        handoffCard.setAttribute("aria-hidden", "true");
        handoffCard.style.setProperty("--handoff-left", `${enteringBounds.left}px`);
        handoffCard.style.setProperty("--handoff-top", `${enteringBounds.top}px`);
        handoffCard.style.setProperty("--handoff-width", `${enteringBounds.width}px`);
        handoffCard.style.setProperty("--handoff-height", `${enteringBounds.height}px`);
        document.body.appendChild(handoffCard);
      }
      track.classList.add("is-rebasing");
      flushSync(() => changeService(nextIndex, direction, false));
      resetServiceDragVisuals(track, start.step);
      track.classList.remove("is-committing", "drag-previous", "drag-next");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          track.classList.remove("is-rebasing");
          handoffCard?.classList.add("is-released");
          window.setTimeout(() => handoffCard?.remove(), 120);
        });
      });
    };
    const handleCommitEnd = (transitionEvent: TransitionEvent) => {
      if (transitionEvent.target !== enteringCard || transitionEvent.propertyName !== "transform") return;
      finishCommit();
    };
    enteringCard?.addEventListener("transitionend", handleCommitEnd);
    fallbackTimer = window.setTimeout(finishCommit, 430);
  };

  const cancelServiceDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = serviceDragStart.current;
    serviceDragStart.current = null;
    const track = event.currentTarget;
    if (start?.frame !== null && start?.frame !== undefined) window.cancelAnimationFrame(start.frame);
    track.classList.remove("is-dragging");
    track.classList.add("is-settling");
    resetServiceDragVisuals(track, start?.step || getServiceTrackStep(track));
    window.setTimeout(() => track.classList.remove("is-settling", "drag-previous", "drag-next"), 360);
  };

  const beginServiceCardTilt = (event: PointerEvent<HTMLElement>, cardOverride?: HTMLButtonElement) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(min-width: 1001px) and (hover: hover) and (pointer: fine)").matches
    ) return;
    const card = cardOverride || event.currentTarget as HTMLButtonElement;
    serviceTiltState.current = {
      card,
      bounds: card.getBoundingClientRect(),
      frame: null,
      clientX: event.clientX,
      clientY: event.clientY
    };
  };

  const tiltServiceCard = (event: PointerEvent<HTMLElement>, cardOverride?: HTMLButtonElement) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(min-width: 1001px) and (hover: hover) and (pointer: fine)").matches
    ) return;
    const eventCard = cardOverride || event.currentTarget as HTMLButtonElement;
    if (!serviceTiltState.current || serviceTiltState.current.card !== eventCard) {
      const card = eventCard;
      serviceTiltState.current = {
        card,
        bounds: card.getBoundingClientRect(),
        frame: null,
        clientX: event.clientX,
        clientY: event.clientY
      };
    }
    const state = serviceTiltState.current;
    state.clientX = event.clientX;
    state.clientY = event.clientY;
    if (state.frame !== null) return;
    state.frame = window.requestAnimationFrame(() => {
      const activeState = serviceTiltState.current;
      if (!activeState) return;
      const { card, bounds, clientX, clientY } = activeState;
      const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height));
      card.style.setProperty("--service-tilt-x", `${((.5 - y) * 12).toFixed(2)}deg`);
      card.style.setProperty("--service-tilt-y", `${((x - .5) * 16).toFixed(2)}deg`);
      card.style.setProperty("--service-glare-x", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--service-glare-y", `${(y * 100).toFixed(1)}%`);
      activeState.frame = null;
    });
  };

  const resetServiceCardTilt = (event: PointerEvent<HTMLElement>, cardOverride?: HTMLButtonElement) => {
    const card = cardOverride || event.currentTarget as HTMLButtonElement;
    const state = serviceTiltState.current;
    if (state?.frame !== null && state?.frame !== undefined) window.cancelAnimationFrame(state.frame);
    serviceTiltState.current = null;
    card.style.setProperty("--service-tilt-x", "0deg");
    card.style.setProperty("--service-tilt-y", "0deg");
    card.style.setProperty("--service-glare-x", "50%");
    card.style.setProperty("--service-glare-y", "50%");
  };

  const clearServiceCardTilt = (card: HTMLButtonElement) => {
    const state = serviceTiltState.current;
    if (state?.frame !== null && state?.frame !== undefined) window.cancelAnimationFrame(state.frame);
    if (state?.card === card) {
      state.frame = null;
      state.bounds = card.getBoundingClientRect();
    }
    card.style.setProperty("--service-tilt-x", "0deg");
    card.style.setProperty("--service-tilt-y", "0deg");
    card.style.setProperty("--service-glare-x", "50%");
    card.style.setProperty("--service-glare-y", "50%");
  };

  const toggleDesktopServiceFlip = () => {
    setServiceFlipped((flipped) => !flipped);
  };

  return (
    <main className="home-page" ref={pageRef}>
      <SiteLoader />
      <ServiceMediaPreloads />

      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-content">
          <h1 aria-label="Ideas, craft and creativity.">
            <span className="hero-line first-line">
              <span>ID</span>
              <span className="hero-e" aria-hidden="true">
                <OptimizedImage src="/figma-assets/hero-e.webp" alt="" loading="eager" />
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
            <span>Selected</span><span>works <TextIcon name="puzzle" label="puzzle piece" /></span>
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
                    <source media="(max-width: 729px)" srcSet="/figma-assets/work-mould-mobile-square.webp" />
                    <OptimizedImage src={work.coverImage} alt="" sizes={HOME_WIDE_COVER_SIZES} />
                  </picture>
                ) : (
                  <OptimizedImage src={work.coverImage} alt="" sizes={HALF_COVER_SIZES} />
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
            {Array.from({ length: 8 }, (_, index) => <TickerItem key={index} />)}
          </div>
        </div>
        <div className="ticker ticker-front" aria-hidden="true">
          <div className="ticker-track reverse">
            {Array.from({ length: 8 }, (_, index) => <TickerItem key={index} />)}
          </div>
        </div>
        <div className="service-stage">
          {isCompactServiceLayout ? (
            <MobileServiceCarousel initialIndex={1} />
          ) : (
            <>
              <button
                className="carousel-arrow previous"
                aria-label="Previous service"
                onClick={() => changeService((serviceIndex + serviceCards.length - 1) % serviceCards.length, "previous")}
              ><OptimizedImage src="/figma-assets/carousel-arrow-left.svg" alt="" /></button>
              <div className={`service-cards desktop-service-cards slide-${serviceMotion.direction} motion-${serviceMotion.tick % 2}`}>
                {[-1, 0, 1].map((offset) => {
                  const cardIndex = (serviceIndex + offset + serviceCards.length) % serviceCards.length;
                  const card = serviceCards[cardIndex];
                  return (
                    <button
                      className={`service-card ${offset === 0 ? `active${serviceFlipped ? " is-flipped" : ""}` : `side-card ${offset < 0 ? "side-previous" : "side-next"}`}`}
                      key={`service-slot-${offset}`}
                      tabIndex={offset === 0 ? 0 : -1}
                      aria-hidden={offset !== 0}
                      aria-pressed={offset === 0 ? serviceFlipped : undefined}
                      aria-label={offset === 0 ? `${card.title}: reveal details` : undefined}
                    >
                      <ServiceCardContent card={card} />
                      <span
                        className="service-card-hit-area"
                        aria-hidden="true"
                        onPointerEnter={offset === 0 ? (event) => beginServiceCardTilt(event, event.currentTarget.parentElement as HTMLButtonElement) : undefined}
                        onPointerMove={offset === 0 ? (event) => tiltServiceCard(event, event.currentTarget.parentElement as HTMLButtonElement) : undefined}
                        onPointerLeave={offset === 0 ? (event) => resetServiceCardTilt(event, event.currentTarget.parentElement as HTMLButtonElement) : undefined}
                        onClick={offset === 0 ? (event) => {
                          event.stopPropagation();
                          const cardElement = event.currentTarget.parentElement as HTMLButtonElement;
                          if (serviceSwipeHandled.current) {
                            serviceSwipeHandled.current = false;
                            return;
                          }
                          clearServiceCardTilt(cardElement);
                          toggleDesktopServiceFlip();
                        } : undefined}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="desktop-service-dots service-dots" aria-label="Choose a service">
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
              ><OptimizedImage src="/figma-assets/carousel-arrow-right.svg" alt="" /></button>
            </>
          )}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <OptimizedImage className="contact-line" src="/figma-assets/contact-line.svg" alt="" aria-hidden="true" />
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
      <PortfolioNav liquidGlass />
    </main>
  );
}
