import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { PortfolioNav, SiteFooter, SiteHeader, SiteLoader } from "../../components/site-chrome";
import { getProject, projects } from "../../projects";
import { AirlineComparison } from "./airline-comparison";
import { AirlineDarkMode } from "./airline-dark-mode";
import { OptimizedImage } from "../../components/optimized-image";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
const media = "/figma-assets/cases/mould-ui";
const southwestMedia = "/figma-assets/cases/southwest-kaia";
const airlineMedia = "/figma-assets/cases/greater-bay-air";
const academyMedia = "/figma-assets/cases/kaia-academy";
const b2bMedia = "/figma-assets/cases/manbangbao";
const truckMedia = "/figma-assets/cases/truck-app";
const zentaoMedia = "/figma-assets/cases/zentao";

const systemCards = [
  ["#ffe8b0", "设计原则", "Principle", "content-10.svg", "简介＆三大原则"],
  ["#e4e4ff", "全局配置", "Configurable", "content-11.svg", "色彩＆字体＆样式"],
  ["#ffe3e1", "组件规范", "Pattern", "content-12.svg", "录入＆展示＆反馈＆导航"],
];

function MouldUiPage() {
  return (
    <main className="mould-page">
      <SiteLoader />
      <SiteHeader />
      <article>
        <section className="mould-hero">
          <div className="mould-hero-copy">
            <h1>Mould UI｜设计系统</h1>
            <div><h2>职责内容</h2><p>研究、分析、产品设计、设计系统、设计指南。</p></div>
            <div className="mould-hero-meta">
              <div><h2>团队规模</h2><p>1名主设计师、10多名实践验证设计师。</p></div>
              <div><h2>时间</h2><p>2022/10</p></div>
            </div>
            <a className="mould-visit" href="https://www.figma.com/proto/mEwrlx93sUoMoqaEVMGWC0/ShowPro?node-id=546-35964&p=f&viewport=238%2C328%2C0.05&scaling=contain&content-scaling=responsive&starting-point-node-id=546%3A35964&page-id=802%3A22788&hotspot-hints=0&disable-default-keyboard-nav=1&hide-ui=1" target="_blank" rel="noreferrer"><span className="mould-button-label">Visit Website</span><span className="mould-button-arrow">→</span></a>
          </div>
          <OptimizedImage className="mould-hero-image" src="/figma-assets/cases/mould-ui/hero.webp" alt="Mould UI 设计系统" />
        </section>

        <section className="mould-body">
          <div className="mould-text"><h2>概述</h2><p>Mould UI设计系统是我们设计团队内部自研的一个公益项目，我们希望在每一次项目实施中可以像搭积木一样将各种不同的设计元素组合在一起，创造出无限可能的产品体验。无论是对于新手还是资深设计师，Mould UI 都为他们提供了一个创作的乐园，让每个团队成员都能发挥出个人的创意和才华。</p></div>
          <div className="mould-text mould-challenge"><h2>主要任务和挑战</h2><p>不同类型的产品存在差异，为了达成个性化及一致性。<strong>我们制定了一系列基础组件规范，通过对不同组件类别进行规范和约束，以维护不同产品的一致性。它包含设计原则、全局配置、组件规范等。</strong></p></div>

          <div className="mould-system-cards">
            {systemCards.map(([color, title, english, icon, detail]) => (
              <article style={{ background: color }} key={title}>
                <div><h3>{title}</h3><p>{english}</p></div>
                <div><OptimizedImage src={`${media}/${icon}`} alt="" /><p>{detail}</p></div>
              </article>
            ))}
          </div>

          <div className="mould-text mould-section-title"><h2>明确设计原则</h2><p>在设计和开发组件库规范之前，先确定设计原则以践行设计价值观过程中行之有效的向导或提示。</p></div>
          <figure className="mould-rounded"><OptimizedImage src={`${media}/content-01.webp`} alt="Mould UI 设计原则" /></figure>
          <figure className="mould-stack">
            {[2, 3, 4].map(n => <OptimizedImage key={n} src={`${media}/content-0${n}.webp`} alt={`Mould UI 全局配置 ${n - 1}`} />)}
          </figure>
          <figure className="mould-rounded"><OptimizedImage src={`${media}/content-05.webp`} alt="Mould UI 组件系统" /></figure>

          <div className="mould-text mould-section-title"><h2>Mould UI｜设计系统平台搭建</h2><p>在设计结束后举行设计评审会，收集当前设计问题并反馈，给出建议解决方法，进行设计组件的迭代。后期以平台化网上冲浪，对团队内部进行宣贯培训。</p></div>
          {[6, 7, 8, 9].map(n => (
            <figure className="mould-platform" key={n}><OptimizedImage src={`${media}/content-0${n}.webp`} alt={`Mould UI 平台展示 ${n - 5}`} /></figure>
          ))}
          <a className="mould-cta" href="/contact"><span className="mould-button-label">Start a project</span><span className="mould-button-arrow">→</span></a>
        </section>

        <section className="mould-more">
          <div className="mould-more-mask" />
          <h2><span>More</span> Projects 📂</h2>
          <div>
            <a className="directory-card" href="/works/huochebang-shipper-app" aria-label="View project: 货车帮｜货主端 APP">
              <OptimizedImage src="/figma-assets/work-truck.webp" alt="" />
              <div><p>货车帮保险业务货主端 APP 设计</p><h2>货车帮｜货主端 APP <span>↗</span></h2></div>
            </a>
            <a className="directory-card" href="/works/greater-bay-airlines" aria-label="View project: 大湾区航空｜移动应用">
              <OptimizedImage src="/figma-assets/work-airline.webp" alt="" />
              <div><p>大湾区航空机票预订移动端设计</p><h2>大湾区航空｜移动应用 <span>↗</span></h2></div>
            </a>
          </div>
        </section>
      </article>
      <SiteFooter />
      <PortfolioNav active={null} />
    </main>
  );
}

type CaseHeroProps = {
  title: string;
  role: string;
  team: string;
  time: string;
  image: string;
};

function CaseHero({ title, role, team, time, image }: CaseHeroProps) {
  return (
    <section className="case-hero">
      <div className="case-hero-copy">
        <h1>{title}</h1>
        <div><h2>职责内容</h2><p>{role}</p></div>
        <div className="case-hero-meta">
          <div><h2>团队规模</h2><p>{team}</p></div>
          <div><h2>时间</h2><p>{time}</p></div>
        </div>
      </div>
      <OptimizedImage className="case-hero-image" src={image} alt={title} loading="eager" fetchPriority="high" sizes="100vw" />
    </section>
  );
}

function CaseCta() {
  return <a className="mould-cta" href="/contact"><span className="mould-button-label">Start a project</span><span className="mould-button-arrow">→</span></a>;
}

function ProjectCard({ slug, image, mobileImage, eyebrow, title, wide = false }: { slug: string; image: string; mobileImage?: string; eyebrow: string; title: string; wide?: boolean }) {
  return (
    <a className={`directory-card${wide ? " wide" : ""}`} href={`/works/${slug}`} aria-label={`View project: ${title}`}>
      {mobileImage ? (
        <picture>
          <source media="(max-width: 729px)" srcSet={mobileImage} />
          <OptimizedImage src={image} alt="" sizes="(max-width: 729px) calc(100vw - 48px), 42vw" />
        </picture>
      ) : (
        <OptimizedImage src={image} alt="" sizes="(max-width: 729px) calc(100vw - 48px), 42vw" />
      )}
      <div><p>{eyebrow}</p><h2>{title} <span>↗</span></h2></div>
    </a>
  );
}

function CaseMore({ children }: { children: ReactNode }) {
  return (
    <section className="case-more">
      <div className="case-more-mask" />
      <h2><span>More</span> Projects 📂</h2>
      <div className="case-more-grid">{children}</div>
    </section>
  );
}

function SouthwestKaiaPage() {
  const firstMedia = [1, 2, 3, 4, 5, 6];
  return (
    <main className="case-page southwest-page">
      <SiteLoader />
      <SiteHeader />
      <article>
        <CaseHero title="西南凯亚｜品牌VI" role="负责前期的量化质化调研、用户访谈、概念化草稿、设计和交付。" team="10名设计师、若干名决策领导层。" time="2019/08" image={`${southwestMedia}/hero.webp`} />
        <section className="case-body">
          <div className="case-text"><h2>概述</h2><p>西南凯亚以大股东中国航信发展战略为指引，以蜀、藏、黔三地为基础，致力于成为西南区域领先的民航、交通、旅游业信息化建设解决方案和综合服务提供商，持续为员工、客户、股东、社会创造最优价值。</p></div>
          {firstMedia.slice(0, 3).map(n => <figure className="case-media" key={n}><OptimizedImage src={`${southwestMedia}/content-0${n}.webp`} alt={`西南凯亚品牌设计过程 ${n}`} /></figure>)}
          <div className="case-text case-section-title"><h2>访谈与调研中，我们梳理几个关键问题：</h2><p>1、了解企业定位是什么？<br />2、企业使命愿景是什么？<br />3、企业的核心价值观是什么？<br />4、作为国企应该传达怎样的企业文化理念？</p></div>
          {firstMedia.slice(3).map(n => <figure className="case-media" key={n}><OptimizedImage src={`${southwestMedia}/content-0${n}.webp`} alt={`西南凯亚调研与探索 ${n}`} /></figure>)}
          <div className="case-text case-section-title"><h2>方案探索</h2><p>对标识的思考本质上是设计师头脑中的思维导图，将所有抽象词汇转化为SYMBOL每个人都可以联想到。并逐步形成草图及绘制。</p></div>
          <figure className="case-media"><OptimizedImage src={`${southwestMedia}/content-07.webp`} alt="西南凯亚标识方案动态探索" /></figure>
          <figure className="case-media"><OptimizedImage src={`${southwestMedia}/content-08.webp`} alt="西南凯亚标识方案" /></figure>
          {[9, 11, 12].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${southwestMedia}/content-${String(n).padStart(2, "0")}.webp`} alt={`西南凯亚品牌视觉 ${n}`} /></figure>)}
          <div className="case-text case-section-title"><h2>品牌基本准则</h2><p>为了确保品牌的正确使用，我们创建了基本的品牌指南，明确了徽标、彩色拼贴画、排版和其他图形元素的适当使用，收集在一个包含所有品牌资产的完整折叠器中，随时可以使用。</p></div>
          <figure className="case-media"><OptimizedImage src={`${southwestMedia}/content-13.webp`} alt="西南凯亚品牌基本准则" /></figure>
          <div className="case-media-pair">
            {[14, 15].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${southwestMedia}/content-${n}.webp`} alt={`西南凯亚品牌应用 ${n}`} /></figure>)}
          </div>
          <figure className="case-media"><OptimizedImage src={`${southwestMedia}/content-16.webp`} alt="西南凯亚品牌应用" /></figure>
          <div className="case-media-pair">
            {[17, 18].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${southwestMedia}/content-${n}.webp`} alt={`西南凯亚品牌应用 ${n}`} /></figure>)}
          </div>
          <figure className="case-media"><OptimizedImage src={`${southwestMedia}/content-19.webp`} alt="西南凯亚品牌应用全景" /></figure>
          <CaseCta />
        </section>
        <CaseMore>
          <ProjectCard wide slug="mould-ui" image="/figma-assets/work-mould.webp" mobileImage="/figma-assets/work-mould-mobile-square.webp" eyebrow="公益设计系统产品设计" title="Mould UI｜设计系统" />
          <ProjectCard slug="greater-bay-airlines" image="/figma-assets/work-airline.webp" eyebrow="大湾区航空机票预订移动端设计" title="大湾区航空｜移动应用" />
          <ProjectCard slug="kaiya-academy" image="/figma-assets/work-academy.webp" eyebrow="凯亚学院品牌与产品设计" title="凯亚学院｜品牌设计" />
        </CaseMore>
      </article>
      <SiteFooter />
      <PortfolioNav active={null} />
    </main>
  );
}

function GreaterBayAirPage() {
  return (
    <main className="case-page airline-page">
      <SiteLoader />
      <SiteHeader />
      <article>
        <CaseHero title="大湾区航空｜移动应用" role="负责功能竞品调研、概念化、客户沟通、设计和交付。" team="2名设计师、4名产品经理和若干名前端工程师。" time="2021/08" image={`${airlineMedia}/hero-1.5x.webp`} />
        <section className="case-body">
          <div className="case-text"><h2>概述</h2><p>大湾区航空是一家改变游戏规则的低成本航空公司，致力于彻底改变了人们的旅行方式提供实惠的票价和丰富的国际航线。</p></div>
          <div className="case-text case-section-title"><h2>主要任务和挑战</h2><p>我们在分析了现有的大湾区航空业务需求，结合中国航信TRP技术框架并再次进行其他航空公司应用分析后，我们确定了3个黄金任务，供我们开始：</p></div>
          <div className="airline-task-cards">
            {[
              ["block-01-01.svg", "更新UI", "创建一套时尚的视觉语言，您几乎可以听到它在低语：“欢迎登岛，探险家！”"],
              ["block-01-02.svg", "改善用户体验", "升级现有功能，并加入一些时髦的交互模式，使应用程序及其用户成为BFF。"],
              ["block-01-03.svg", "添加新功能", "通过实现令人兴奋的特性和功能来改善与应用程序的交互。"],
            ].map(([icon, title, copy]) => (
              <article key={title}><OptimizedImage src={`${airlineMedia}/${icon}`} alt="" /><div><h3>{title}</h3><p>{copy}</p></div></article>
            ))}
          </div>
          <div className="case-text case-section-title"><h2>大湾区航空应用程序遇到了风格问题，造成了不必要的视觉体验动荡。</h2><p>我们给UI和UX都进行了VIP改造，以确保通过应用程序进行快速、愉悦和直观的购票体验，用于所有旅行。</p></div>
          <AirlineComparison />
          <figure className="case-media"><OptimizedImage src={`${airlineMedia}/block-03-01.webp`} alt="大湾区航空移动应用核心界面" /></figure>
          <figure className="case-media"><OptimizedImage src={`${airlineMedia}/block-04-01.webp`} alt="大湾区航空移动应用视觉设计" /></figure>
          <figure className="case-media case-media-stack">{[1, 2, 3].map(n => <OptimizedImage key={n} src={`${airlineMedia}/block-05-0${n}.webp`} alt={`大湾区航空移动应用界面 ${n}`} />)}</figure>
          <AirlineDarkMode />
          <figure className="case-media case-media-stack">{[1, 2].map(n => <OptimizedImage key={n} src={`${airlineMedia}/block-07-0${n}.webp`} alt={`大湾区航空移动应用设计展示 ${n}`} />)}</figure>
          <CaseCta />
        </section>
        <CaseMore>
          <ProjectCard slug="zentao" image="/figma-assets/work-zentao.webp" eyebrow="禅道全新品牌与产品体验设计" title="禅道｜产品设计" />
          <ProjectCard slug="southwest-kaiya" image="/figma-assets/work-rebrand.webp" eyebrow="西南凯亚品牌视觉升级" title="西南凯亚｜品牌VI" />
        </CaseMore>
      </article>
      <SiteFooter />
      <PortfolioNav active={null} />
    </main>
  );
}

function StaticMedia({ base, count, ext = "webp", label }: { base: string; count: number; ext?: string; label: string }) {
  return <>{Array.from({ length: count }, (_, i) => <figure className="case-media" key={i}><OptimizedImage src={`${base}/content-${String(i + 1).padStart(2, "0")}.${ext}`} alt={`${label} ${i + 1}`} /></figure>)}</>;
}

function KaiyaAcademyPage() {
  return (
    <main className="case-page academy-page">
      <SiteLoader /><SiteHeader />
      <article>
        <CaseHero title="凯亚学院｜品牌VI" role="负责前期调研、问卷及访谈、洞察及收敛、概念化草稿、设计和交付。" team="1名设计师和1名直属领导干系人" time="2020/06" image={`${academyMedia}/hero.webp`} />
        <section className="case-body">
          <div className="case-text"><h2>概述</h2><p>凯亚学院依托西南凯亚，专注民航业企业变革管理赋能提供战略顾问、讲师授课、变革咨询及变革云等服务，聚焦并持续探索民航企业发展困境和挑战，致力于成为民航业变革综合解决方案服务商，让变革更容易，帮助客户全面提升客户资本、人力资本、管理资本，助力企业转型升级，实现从1到N的跨越。</p></div>
          <div className="case-text case-section-title"><h2>#设计如何执行？</h2><p><strong>一、前期调查：</strong>通过研究和宣传资料收集了解凯亚学院的现状<br /><strong>二、问卷及访谈：</strong>发放问卷和访谈干系人了解凯亚学院未来发展愿景和收集印象偏好<br /><strong>三、洞察及收敛：</strong>梳理问卷结果收敛品牌探索方向及后期产出，以建立完整的品牌系统做好准备<br /><strong>四、设计执行：</strong>根据品牌定位及核心价值，设计品牌识别及视觉形象</p></div>
          <figure className="case-media"><OptimizedImage src={`${academyMedia}/content-01.webp`} alt="凯亚学院品牌调研" /></figure>
          <div className="case-text case-section-title"><h2>透过洞察及收敛，定位品牌核心与拟定设计策略</h2><p>从问卷与访谈资料交叉比对后，我们发现大众对品牌的印象不明确，以及对品牌内容的感受有所落差。所以借此访谈机会，我们将重新定位品牌核心，并塑造视觉标志及提升品牌体验，作为此次品牌建设的重点。</p></div>
          <figure className="case-media case-media-stack">{[2, 3].map(n => <OptimizedImage key={n} src={`${academyMedia}/content-0${n}.webp`} alt={`凯亚学院品牌洞察 ${n - 1}`} />)}</figure>
          <div className="case-text case-section-title"><h2>设计策略：确定品牌定位及塑造品牌形象</h2><p><strong>定位目标：</strong>我们提供的不是一次课程，而是把事做成的智慧。专注“变革 管理 赋能”的企业大学。<br /><strong>标识元素：</strong>① 展开书籍，是知识传播的开端 / ② 向上箭头，是进取心灵的指引</p></div>
          <figure className="case-media"><OptimizedImage src={`${academyMedia}/content-04.webp`} alt="凯亚学院品牌设计策略" /></figure>
          <figure className="case-media"><OptimizedImage src={`${academyMedia}/content-05.webp`} alt="凯亚学院标识系统" /></figure>
          <figure className="case-media case-media-stack">{[6, 7].map(n => <OptimizedImage key={n} src={`${academyMedia}/content-0${n}.webp`} alt={`凯亚学院品牌系统 ${n}`} />)}</figure>
          <div className="case-text case-section-title"><h2>建立简单易延展的视觉系统</h2><p>我们为凯亚学院品牌规划了信息呈现系统与辅助图形，以此让未来视觉延伸便利与一致。品牌形态系统能够不断堆叠连接、延展，让包装、企业宣传物应用更便利。</p></div>
          {[8, 9, 10].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${academyMedia}/content-${String(n).padStart(2, "0")}.webp`} alt={`凯亚学院视觉应用 ${n - 7}`} /></figure>)}
          <div className="case-media-pair">{[11, 12].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${academyMedia}/content-${n}.webp`} alt={`凯亚学院品牌应用 ${n}`} /></figure>)}</div>
          <figure className="case-media"><OptimizedImage src={`${academyMedia}/content-13.webp`} alt="凯亚学院品牌应用全景" /></figure>
          <CaseCta />
        </section>
        <CaseMore>
          <ProjectCard slug="southwest-kaiya" image="/figma-assets/work-rebrand.webp" eyebrow="西南凯亚官方品牌重塑" title="西南凯亚｜品牌VI" />
          <ProjectCard slug="manbang-insurance" image="/figma-assets/work-insurance.webp" eyebrow="满帮保货车保险运营平台产品设计" title="满帮保｜B2B平台" />
        </CaseMore>
      </article>
      <SiteFooter /><PortfolioNav active={null} />
    </main>
  );
}

function ManbangB2BPage() {
  return (
    <main className="case-page b2b-page">
      <SiteLoader /><SiteHeader />
      <article>
        <CaseHero title="满帮保｜B2B平台" role="负责视觉风格定位及后期产品优化。" team="1名UI设计师、1名产品经理" time="2018/08" image={`${b2bMedia}/hero.webp`} />
        <section className="case-body">
          <div className="case-text"><h2>概述</h2><p>满帮保是一款综合性货车保险运营平台，集合出单/展业/运营/服务于一体。在物流保险领域当中，对保险公司的渠道议价、对专业中介的技术产品整合。</p></div>
          <StaticMedia base={b2bMedia} count={9} label="满帮保 B2B 平台设计" />
          <CaseCta />
        </section>
        <CaseMore>
          <ProjectCard slug="kaiya-academy" image="/figma-assets/work-academy.webp" eyebrow="凯亚学院官方品牌塑造" title="凯亚学院｜品牌VI" />
          <ProjectCard slug="huochebang-shipper-app" image="/figma-assets/work-truck.webp" eyebrow="货车帮保险业务货主端APP设计" title="货车帮｜货主端APP" />
        </CaseMore>
      </article>
      <SiteFooter /><PortfolioNav active={null} />
    </main>
  );
}

function TruckAppPage() {
  return (
    <main className="case-page truck-page">
      <SiteLoader /><SiteHeader />
      <article>
        <CaseHero title="货车帮 I 货主端APP" role="负责视觉风格定位及后期产品优化。" team="1名视觉设计师、1名交互设计师" time="2018/10" image={`${truckMedia}/hero.webp`} />
        <section className="case-body">
          <div className="case-text"><h2>概述</h2><p>在货车帮货主端APP上，保险业务入口集合出单/展业/运营/服务于一体。为货车帮货主用户提供方便快捷的购买保险服务。</p></div>
          <StaticMedia base={truckMedia} count={8} label="货车帮货主端 APP 设计" />
          <CaseCta />
        </section>
        <CaseMore>
          <ProjectCard slug="manbang-insurance" image="/figma-assets/work-insurance.webp" eyebrow="满帮保货车保险运营平台产品设计" title="满帮保｜B2B平台" />
          <ProjectCard slug="zentao" image="/figma-assets/work-zentao.webp" eyebrow="禅道项目管理平台设计" title="禅道｜项目管理平台" />
        </CaseMore>
      </article>
      <SiteFooter /><PortfolioNav active={null} />
    </main>
  );
}

function ZentaoPage() {
  return (
    <main className="case-page zentao-page">
      <SiteLoader /><SiteHeader />
      <article>
        <CaseHero title="禅道丨项目管理平台" role="负责视觉风格定位及前期评审，以为后期团队成员设计页面做铺垫。" team="3名视觉设计师、2名交互设计师和若干名前端工程师。" time="2017/08" image={`${zentaoMedia}/hero.webp`} />
        <section className="case-body">
          <div className="case-text"><h2>概述</h2><p>禅道是一款国内的开源项目管理软件。专注研发项目管理、内置需求管任务管理及用例管理等项目管理功能，实现开发软件的完整生命周期管理平台。</p></div>
          {[1, 2].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${zentaoMedia}/content-0${n}.webp`} alt={`禅道项目管理平台设计 ${n}`} /></figure>)}
          {[3, 4, 5, 6, 7, 8].map(n => <figure className="case-media" key={n}><OptimizedImage src={`${zentaoMedia}/content-0${n}.webp`} alt={`禅道项目管理平台界面 ${n}`} /></figure>)}
          <CaseCta />
        </section>
        <CaseMore>
          <ProjectCard wide slug="mould-ui" image="/figma-assets/work-mould.webp" mobileImage="/figma-assets/work-mould-mobile-square.webp" eyebrow="一套激发创造力、打破传统束缚的设计系统" title="Mould UI｜设计系统" />
          <ProjectCard slug="greater-bay-airlines" image="/figma-assets/work-airline.webp" eyebrow="大湾区航空机票预订移动端设计" title="大湾区航空｜移动应用" />
          <ProjectCard slug="kaiya-academy" image="/figma-assets/work-academy.webp" eyebrow="凯亚学院官方品牌塑造" title="凯亚学院｜品牌VI" />
        </CaseMore>
      </article>
      <SiteFooter /><PortfolioNav active={null} />
    </main>
  );
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `${project.title} — Kevin Wu`, description: project.summary, openGraph: { title: `${project.title} — Kevin Wu`, description: project.summary, images: [project.coverImage] } };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (slug === "mould-ui") return <MouldUiPage />;
  if (slug === "southwest-kaiya") return <SouthwestKaiaPage />;
  if (slug === "greater-bay-airlines") return <GreaterBayAirPage />;
  if (slug === "kaiya-academy") return <KaiyaAcademyPage />;
  if (slug === "manbang-insurance") return <ManbangB2BPage />;
  if (slug === "huochebang-shipper-app") return <TruckAppPage />;
  if (slug === "zentao") return <ZentaoPage />;
  notFound();
}
