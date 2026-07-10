const works = [
  {
    title: "西南凯亚｜品牌 VI",
    type: "Brand identity",
    image: "/figma-assets/work-a.svg",
  },
  {
    title: "大湾区航空｜APP",
    type: "Mobile product",
    image: "/figma-assets/work-b.png",
  },
  {
    title: "Mould UI｜设计系统",
    type: "Design system",
    image: "/figma-assets/work-c.png",
  },
];

const services = [
  ["Branding", "品牌设计 / 策略 / 识别"],
  ["Product Design", "移动应用 / B2B 平台 / Web 体验"],
  ["Design Systems", "组件规范 / Token / 体验一致性"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kevin Wu home">
          <span>Kevin Wu</span>
          <small>creative designer</small>
        </a>
        <a className="pill" href="mailto:hello@kevinwu.design">
          → Let&apos;s connect
        </a>
      </header>

      <section className="hero" id="top">
        <div>
          <h1>
            IDEAS, CRAFT
            <br />&amp; CREATIVITY.
          </h1>
          <p>Focusing on brand building and user interface design ↓</p>
        </div>
        <div className="orb" aria-hidden="true">
          <img src="/figma-assets/k-logo.png" alt="" />
        </div>
      </section>

      <section className="panel" id="works" aria-labelledby="works-title">
        <h2 id="works-title">Selected works 🧩</h2>
        <div className="work-grid">
          {works.map((work) => (
            <article className="work-card" key={work.title}>
              <img src={work.image} alt="" />
              <div>
                <span>{work.type}</span>
                <h3>{work.title}</h3>
              </div>
            </article>
          ))}
        </div>
        <a className="big-button" href="#contact">
          See More
        </a>
      </section>

      <section className="services" aria-labelledby="services-title">
        <p className="marquee" aria-hidden="true">
          what can I do ⇥ what can I do ⇤ what can I do ⇥
        </p>
        <h2 id="services-title">What can I do</h2>
        <div className="service-row">
          {services.map(([title, detail]) => (
            <article className="service-card" key={title}>
              <div className="service-art" />
              <h3>{title} ↗</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <p>Are you ready?</p>
        <h2 id="contact-title">Let&apos;s talk about your product.</h2>
        <a className="pill dark" href="mailto:hello@kevinwu.design">
          Contact me →
        </a>
      </section>

      <footer>
        <span>Copyright ⓒ 2026 K-STUDIO.</span>
        <nav aria-label="Social links">
          <a href="https://dribbble.com/kevin-vay">Dribbble</a>
          <a href="https://www.instagram.com/kevin.vay/">Instagram</a>
          <a href="https://www.linkedin.com/in/kevin-vay/details/experience/">
            LinkedIn
          </a>
        </nav>
      </footer>
    </main>
  );
}
