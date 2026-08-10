import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "../components/site-chrome";
import { FrameAnimation } from "../components/frame-animation";
import { StatsStack } from "../components/stats-stack";

const greeting = "Hello! I’m Kevin Wu. 👋🏻";

export default function AboutPage() {
  return (
    <main className="inner-page about-page">
      <SiteLoader />
      <SiteHeader />
      <section className="inner-hero">
        <div className="inner-hero-copy">
          <h1><span>THE NEXT</span><span>CO<span className="title-media title-media-o"><img src="/figma-assets/inner/title-o.png" alt="O" /></span>L THING.</span></h1>
          <p>Why Don&apos;t We Try is my motto<br /><span>and this is my experiences ↓<i aria-hidden="true" /></span></p>
        </div>
        <FrameAnimation name="about" />
      </section>
      <div className="about-intro">
        <section className="hello-strip" aria-label={greeting}>
          <div className="hello-track" aria-hidden="true">
            {[0, 1].map((group) => <span className="hello-group" key={group}>{[0, 1, 2].map((item) => <span key={item}>{greeting}</span>)}</span>)}
          </div>
        </section>
        <section className="about-story">
          <div className="about-copy">
            <p>With more than ten years of experience in digital experience design, I turn meaningful problems into simple, memorable solutions. I stay curious—always exploring new ways of working, building new skills and learning from new industries.</p>
            <p>我拥有十余年数字体验设计经验，致力于将有意义的问题转化为简单、清晰且令人难忘的解决方案。我始终保持好奇，持续探索新的工作方式、拓展专业技能，并从不同行业中汲取灵感。</p>
          </div>
          <img src="/figma-assets/about-photo-figma.png" alt="Kevin Wu" />
        </section>
      </div>
      <StatsStack />
      <section className="experience-panel">
        <div className="experience-copy">
          <h2>Experience.</h2>
          <p>2016 Year - Present</p>
          <a href="/experience"><span>Launch site</span><i aria-hidden="true">→</i></a>
        </div>
        <span className="pixel-bird" aria-hidden="true" />
      </section>
      <SiteFooter />
      <PortfolioNav active="about" />
    </main>
  );
}
