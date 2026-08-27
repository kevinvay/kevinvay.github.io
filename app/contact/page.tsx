"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "../components/site-chrome";
import { OptimizedImage } from "../components/optimized-image";
import { TextIcon } from "../components/text-icon";

const principles = [
  ["/figma-assets/inner/principle-business.webp", "Business Value", "As designers, we are connecting what users need with what companies can offer for sustainable long-term value.", "作为设计师，我们将用户的需求与公司能够提供的可持续长期价值联系起来。"],
  ["/figma-assets/inner/principle-purpose.webp", "With Purpose", "I ask a lot of questions. I listen and learn. I am eager to discover as much as possible about challenges, motivations, and goals.", "我渴望尽可能多地发现挑战、动机和目标；我愿意倾听和学习，并提出许多问题。"],
  ["/figma-assets/inner/principle-simple.webp", "Keep It Simple", "Less is more. I keep things clear even when the challenge appears complex.", "少即是多，即使面对复杂问题也保持清晰。"],
  ["/figma-assets/inner/principle-emotion.webp", "Emotional Design", "According to Maslow's theory, human needs and decisions ultimately follow emotions, and we design for emotions.", "根据马斯洛理论，人的需求和决定最终都遵循情感，而我们为情感而设计。"],
];

const plans = {
  branding: [
    ["Brief", "概要", ["Scope 范围", "Delivery 交付", "Deadline 截止日期"]],
    ["Direction", "方针", ["Research 研究", "Strategy 策略", "Early concepts 早期概念", "Discussion 访谈"]],
    ["Design", "设计", ["Logo Refinement 标识细化", "Color / Font 颜色 / 字体", "Brand Application 品牌应用", "Revisions 修订"]],
    ["Handoff", "交付", ["Brand guideline 品牌指南", "Figma / AI file Figma / AI 文件"]],
  ],
  digital: [
    ["Brief", "概要", ["Scope 范围", "Delivery 交付", "Deadline 截止日期"]],
    ["Wireframe", "草图", ["Content 需求内容", "Definition 定义问题", "Structure 功能框架", "Copywriting 文案策划"]],
    ["Hi-Fi", "高保真原型", ["Style design (2–3) 方案 (2–3)", "Pages design 页面设计", "Revisions 修订"]],
    ["Handoff", "交付", ["Figma file Figma 文件", "Design system 设计系统", "json file json语言文件"]],
  ],
} as const;

function RotatingPrinciples() {
  const rotatingPrinciples = [...principles, ...principles];
  const orbitRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const dragRef = useRef<{ pointerId: number; startX: number; startRotation: number } | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - previous, 48);
      previous = now;
      if (!pausedRef.current && !dragRef.current) rotationRef.current += delta * .012;
      orbitRef.current?.style.setProperty("--principles-rotation", `${rotationRef.current}deg`);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startRotation: rotationRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    rotationRef.current = drag.startRotation + (event.clientX - drag.startX) * .18;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className="principles-rotator"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="principles-orbit" ref={orbitRef}>
        {rotatingPrinciples.map(([icon, title, copy, cn], index) => (
          <article
            key={`${title}-${index}`}
            onMouseEnter={(event) => {
              pausedRef.current = true;
              event.currentTarget.style.setProperty("--principle-hover-scale", "1.045");
            }}
            onMouseLeave={(event) => {
              pausedRef.current = false;
              event.currentTarget.style.setProperty("--principle-hover-scale", "1");
            }}
            style={{ "--principle-index": index } as CSSProperties}
          >
            <OptimizedImage className="principle-icon" src={icon} alt="" />
            <h3>{title}</h3>
            <p>{copy}</p>
            <small>{cn}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [planType, setPlanType] = useState<keyof typeof plans>("branding");
  const [wechatFlipped, setWechatFlipped] = useState(false);
  const planViewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = planViewportRef.current;
    if (!viewport) return;

    const panels = Array.from(viewport.querySelectorAll<HTMLElement>(".plan-panel"));
    const syncTrack = () => {
      const panelHeight = Math.max(...panels.map((panel) => panel.getBoundingClientRect().height));
      const track = viewport.querySelector<HTMLElement>(".plan-track");
      const trackGap = track ? Number.parseFloat(window.getComputedStyle(track).rowGap) || 0 : 0;
      viewport.style.height = `${panelHeight}px`;
      viewport.style.setProperty("--plan-shift", `-${panelHeight + trackGap}px`);
    };
    const observer = new ResizeObserver(syncTrack);

    panels.forEach((panel) => observer.observe(panel));
    syncTrack();

    return () => observer.disconnect();
  }, []);

  return (
    <main className="inner-page contact-page">
      <SiteLoader />
      <SiteHeader />
      <section className="inner-hero contact-hero">
        <div className="inner-hero-copy">
          <h1><span>LE<span className="title-media title-media-t"><OptimizedImage src="/figma-assets/inner/title-t.webp" alt="T" loading="eager" /></span>&apos;S</span><span>COLLAB.</span></h1>
          <p>Thanks for visiting.<br /><span>And that&apos;s the way I work ↓<i aria-hidden="true" /></span></p>
        </div>
        <button type="button" className={`wechat-card${wechatFlipped ? " is-flipped" : ""}`} aria-label="Flip WeChat contact card" aria-pressed={wechatFlipped} onClick={() => setWechatFlipped((flipped) => !flipped)}>
          <span className="wechat-card-inner">
            <span className="wechat-card-face wechat-card-front"><OptimizedImage src="/figma-assets/inner/wechat-front-figma.svg" alt="" /><b>WECHAT ↗</b></span>
            <span className="wechat-card-face wechat-card-back"><span><OptimizedImage src="/figma-assets/inner/wechat-qr-figma.webp" alt="Contact QR code" /></span></span>
          </span>
        </button>
      </section>
      <section className="project-scope" aria-label="Project scope">
        <div ref={planViewportRef} className={`project-plan project-plan-${planType}`}>
          <div className="plan-track">
            {(["branding", "digital"] as const).map((type) => (
              <div className={`plan-panel plan-panel-${type}${planType === type ? " is-active" : ""}`} key={type} aria-hidden={planType !== type}>
                <div className="plan-heading"><h2>Plans</h2><OptimizedImage src={type === "branding" ? "/figma-assets/inner/plan-crystal.svg" : "/figma-assets/inner/plan-crystal-digital.svg"} alt="" /></div>
                <div className="plan-grid">
                  {plans[type].map(([title, subtitle, lines]) => (
                    <article key={title}><h3>{title}<small>{subtitle}</small></h3><p>{lines.map((line) => <span key={line}>{line}</span>)}</p></article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="scope-tabs" aria-label="Project type">
          <button type="button" className={planType === "branding" ? "is-active" : ""} onClick={() => setPlanType("branding")}><span>Branding Project *</span><small>Depending on your scope</small></button>
          <button type="button" className={planType === "digital" ? "is-active" : ""} onClick={() => setPlanType("digital")}><span>Digital Project *</span><small>Depending on your scope</small></button>
        </div>
      </section>
      <section className="principles-section">
        <h2>What I stick to <TextIcon name="ribbon" label="ribbon" /></h2>
        <RotatingPrinciples />
      </section>
      <SiteFooter />
      <PortfolioNav active="contact" />
    </main>
  );
}
