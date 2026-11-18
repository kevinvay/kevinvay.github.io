import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "../components/site-chrome";
import { FrameAnimation } from "../components/frame-animation";
import { StatsStack } from "../components/stats-stack";
import { OptimizedImage } from "../components/optimized-image";
import { TextIcon } from "../components/text-icon";

const greeting = "Hello! I’m Kevin Wu, waving hello.";

export default function AboutPage() {
  return (
    <main className="inner-page about-page">
      <SiteLoader />
      <SiteHeader />
      <section className="inner-hero">
        <div className="inner-hero-copy">
          <h1><span>THE NEXT</span><span>CO<span className="title-media title-media-o"><OptimizedImage src="/figma-assets/inner/title-o.webp" alt="O" loading="eager" /></span>L THING.</span></h1>
          <p>Why Don&apos;t We Try is my motto<br /><span>and this is my experiences ↓<i aria-hidden="true" /></span></p>
        </div>
        <FrameAnimation name="about" />
      </section>
      <div className="about-intro">
        <section className="hello-strip" aria-label={greeting}>
          <div className="hello-track" aria-hidden="true">
            {[0, 1].map((group) => <span className="hello-group" key={group}>{[0, 1, 2].map((item) => <span key={item}>Hello! I’m Kevin Wu. <TextIcon name="wave" /></span>)}</span>)}
          </div>
        </section>
        <section className="about-story">
          <div className="about-copy">
            <p>Hey！</p>
            <p>I have more than Ten years of experience in digital experience design. As a designer, as long as I can solve meaningful problems and help people find simple and unforgettable solutions. I am willing to learn and adapt to new ways of working, new skills and new industries.</p>
          </div>
          <OptimizedImage src="/figma-assets/about-photo-figma.webp" alt="Kevin Wu" />
        </section>
      </div>
      <StatsStack />
      <section className="about-patents" aria-labelledby="patents-title">
        <h2 id="patents-title">Some Patents <img alt="" aria-hidden="true" src="/figma-assets/patent-trophy.png" /></h2>
        <div className="patent-grid">
          <a href="http://epub.cnipa.gov.cn/patent/CN306424073S" target="_blank" rel="noreferrer">
            <span className="patent-main">
              <span className="patent-head">
                <span className="patent-marks">
                  <img className="patent-mark" src="/figma-assets/cnipa.png" alt="" />
                  <img className="patent-mark is-color" src="/figma-assets/cnipa-color.png" alt="" />
                </span>
                <img className="patent-arrow" src="/figma-assets/patent-arrow.svg" alt="" />
              </span>
              <strong>Doll (Benben)</strong>
              <b>CN306424073S</b>
            </span>
            <small>2ST INVENTOR</small>
          </a>
          <a href="http://epub.cnipa.gov.cn/patent/CN309842885S" target="_blank" rel="noreferrer">
            <span className="patent-main">
              <span className="patent-head">
                <span className="patent-marks">
                  <img className="patent-mark" src="/figma-assets/cnipa.png" alt="" />
                  <img className="patent-mark is-color" src="/figma-assets/cnipa-color.png" alt="" />
                </span>
                <img className="patent-arrow" src="/figma-assets/patent-arrow.svg" alt="" />
              </span>
              <strong>Graphical user interface for statistical query of electronic devices.</strong>
              <b>CN309842885S</b>
            </span>
            <small>1ST INVENTOR</small>
          </a>
        </div>
      </section>
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
