export type Project = {
  slug: string;
  title: string;
  description: string;
  headline: string;
  summary: string;
  coverImage: string;
  wide?: boolean;
  discipline: string;
  field: string;
  focus: string;
  challenge: string;
  approach: string;
  outcome: string;
  keywords: string[];
  colors: string[];
  theme: {
    accent: string;
    accentAlt: string;
    surface: string;
    ink: string;
  };
  relatedSlugs: string[];
};

export const projects: Project[] = [
  {
    slug: "mould-ui",
    title: "Mould UI｜设计系统",
    description: "一套激发创造力、打破传统束缚的设计系统",
    headline: "A System for Making",
    summary: "从设计原则、视觉变量到组件与文档，搭建一套可持续演进的界面设计系统。",
    coverImage: "/figma-assets/work-mould.webp",
    wide: true,
    discipline: "Design System & UI Design",
    field: "设计系统",
    focus: "Foundations / Components / Guidelines",
    challenge: "既有界面模式分散，复用方式与协作语言不统一。",
    approach: "梳理高频场景，定义色彩、字体、间距等基础变量，再沉淀组件、状态与使用规范。",
    outcome: "形成可复用的设计基础，让不同页面在保留表达空间的同时保持一致。",
    keywords: ["Design tokens", "Components", "Guidelines", "Prototyping"],
    colors: ["#594DFF", "#5DA8FF", "#FF5B63", "#FFD34D", "#EEF2FF"],
    theme: { accent: "#594DFF", accentAlt: "#FF5B63", surface: "#EEF2FF", ink: "#17152D" },
    relatedSlugs: ["huochebang-shipper-app", "greater-bay-airlines"],
  },
  {
    slug: "greater-bay-airlines",
    title: "大湾区航空｜移动应用",
    description: "大湾区航空机票预订移动端设计",
    headline: "Booking, Made Clear",
    summary: "围绕移动端订票旅程，重新组织航班搜索、选择与订单信息，让关键决策更清楚。",
    coverImage: "/figma-assets/work-airline.webp",
    discipline: "Product & Interaction Design",
    field: "航空出行",
    focus: "Mobile Booking / UX Flow / Prototype",
    challenge: "订票步骤长、规则信息多，移动端需要同时兼顾效率与信任感。",
    approach: "按搜索、选航班、填写乘机人、确认与支付重组流程，通过渐进披露与明确反馈降低理解负担。",
    outcome: "完成一套贯穿核心订票路径的移动端方案与可复用界面语言。",
    keywords: ["Mobile booking", "UX flow", "Interaction", "Prototype"],
    colors: ["#1E6DAE", "#2FA3BE", "#BFEFF0", "#F3FAFB", "#18232C"],
    theme: { accent: "#2FA3BE", accentAlt: "#1E6DAE", surface: "#E8F8F8", ink: "#18232C" },
    relatedSlugs: ["zentao", "southwest-kaiya"],
  },
  {
    slug: "kaiya-academy",
    title: "凯亚学院｜品牌 VI",
    description: "凯亚学院官方品牌塑造",
    headline: "A Brand for Learning",
    summary: "为凯亚学院建立兼具专业感与亲和力的品牌识别，并适配线上与线下学习场景。",
    coverImage: "/figma-assets/work-academy.webp",
    discipline: "Brand Identity Design",
    field: "教育培训",
    focus: "Brand Strategy / Identity / Applications",
    challenge: "品牌需要传达专业可信，同时避免传统教育视觉的距离感。",
    approach: "从品牌定位与核心概念出发，发展标志、字体、色彩和应用版式，并验证多媒介延展。",
    outcome: "形成清晰、易识别且可持续扩展的视觉识别基础。",
    keywords: ["Brand strategy", "Visual identity", "Logo", "Applications"],
    colors: ["#0D75C9", "#28D5C8", "#082D53", "#EAF9F7", "#FFFFFF"],
    theme: { accent: "#0D75C9", accentAlt: "#28D5C8", surface: "#EAF9F7", ink: "#082D53" },
    relatedSlugs: ["southwest-kaiya", "manbang-insurance"],
  },
  {
    slug: "southwest-kaiya",
    title: "西南凯亚｜品牌 VI",
    description: "西南凯亚官方品牌重塑",
    headline: "A Clearer Brand System",
    summary: "在延续原有认知的基础上，重整西南凯亚的品牌表达与视觉秩序。",
    coverImage: "/figma-assets/work-rebrand.webp",
    discipline: "Brand Strategy & Rebranding",
    field: "企业品牌",
    focus: "Identity System / Guidelines / Rollout",
    challenge: "既有视觉缺少统一规则，不同业务触点之间辨识与一致性不足。",
    approach: "审视原有资产与使用场景，提炼品牌叙事，优化标志、色彩、版式和常用模板。",
    outcome: "建立更统一的品牌系统，为后续传播与业务应用提供明确依据。",
    keywords: ["Rebranding", "Identity system", "Guidelines", "Rollout"],
    colors: ["#2577F3", "#59B8F8", "#F3652B", "#F5A26B", "#EFF6FF"],
    theme: { accent: "#2577F3", accentAlt: "#F3652B", surface: "#EFF6FF", ink: "#132B48" },
    relatedSlugs: ["mould-ui", "greater-bay-airlines", "kaiya-academy"],
  },
  {
    slug: "manbang-insurance",
    title: "满帮保｜B2B 平台",
    description: "满帮保货车保险运营平台产品设计",
    headline: "Insurance Operations, Unified",
    summary: "面向物流保险业务，将产品、投保与运营信息组织进一套清晰的 B2B 平台体验。",
    coverImage: "/figma-assets/work-insurance.webp",
    discipline: "Product & UX/UI Design",
    field: "物流保险 B2B",
    focus: "Information Architecture / Workflow / Dashboard",
    challenge: "角色、保险产品与业务状态较多，运营人员需要快速定位和处理信息。",
    approach: "梳理角色与任务流程，重构信息架构，并统一列表、筛选、表单和状态反馈模式。",
    outcome: "形成覆盖关键运营场景的桌面端产品框架，支持信息查看与业务处理。",
    keywords: ["B2B platform", "Information architecture", "Workflow", "Dashboard"],
    colors: ["#FF8A00", "#F45B22", "#264E57", "#F6E3C5", "#FFF9F0"],
    theme: { accent: "#FF8A00", accentAlt: "#F45B22", surface: "#FFF4E3", ink: "#264E57" },
    relatedSlugs: ["kaiya-academy", "huochebang-shipper-app"],
  },
  {
    slug: "huochebang-shipper-app",
    title: "货车帮｜货主端 APP",
    description: "货车帮保险业务货主端 APP 设计",
    headline: "Insurance in the Journey",
    summary: "把保险选购与保单服务融入货主端工作流，让保障信息更易理解和操作。",
    coverImage: "/figma-assets/work-truck.webp",
    discipline: "Mobile Product Design",
    field: "物流保险",
    focus: "Embedded Insurance / Mobile UX / Service Flow",
    challenge: "保险术语与投保步骤容易打断发货任务，用户也需要更透明的保障与服务状态。",
    approach: "按实际使用场景组织产品推荐、报价、投保、保单与理赔入口，强化关键信息层级。",
    outcome: "完成从了解产品到管理保单的移动端闭环方案，并与货主端体验保持衔接。",
    keywords: ["Embedded insurance", "Mobile UX", "Service flow", "UI design"],
    colors: ["#21C7B6", "#38BCE6", "#FF9D3D", "#F4B3A3", "#F4FBFA"],
    theme: { accent: "#21C7B6", accentAlt: "#FF9D3D", surface: "#E9FBF7", ink: "#153D43" },
    relatedSlugs: ["manbang-insurance", "zentao"],
  },
  {
    slug: "zentao",
    title: "禅道｜项目管理平台",
    description: "禅道项目管理平台设计",
    headline: "Complex Work, Made Visible",
    summary: "重整禅道项目管理平台的信息层级，让项目、任务与进度状态更易查找和判断。",
    coverImage: "/figma-assets/work-zentao.webp",
    discipline: "UX/UI & Information Design",
    field: "企业项目管理",
    focus: "Dashboard / Data Display / Design Patterns",
    challenge: "功能模块多、信息密度高，不同角色需要在同一系统中快速理解项目状态。",
    approach: "围绕核心工作流重构导航与页面层级，以仪表盘、状态表达和组件规则承载复杂信息。",
    outcome: "形成兼顾信息密度与可读性的桌面端方案，改善跨模块浏览与任务定位。",
    keywords: ["Enterprise UX", "Dashboard", "Data display", "Design patterns"],
    colors: ["#0788F5", "#0062E9", "#31C9F5", "#65C76F", "#F3F8FC"],
    theme: { accent: "#0788F5", accentAlt: "#65C76F", surface: "#EAF5FF", ink: "#12334F" },
    relatedSlugs: ["mould-ui", "greater-bay-airlines", "kaiya-academy"],
  },
];

export const homeProjectSlugs = ["southwest-kaiya", "greater-bay-airlines", "mould-ui"];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjects(slugs: string[]) {
  return slugs.map(getProject).filter((project): project is Project => Boolean(project));
}

export const homeProjects = getProjects(homeProjectSlugs);
