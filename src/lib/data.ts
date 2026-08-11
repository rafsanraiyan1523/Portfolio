/**
 * Single source of truth for the site.
 * Every fact here comes from Rafsan Raiyan's CV — edit this file to update the site.
 */

export const person = {
  name: "Rafsan Raiyan",
  firstName: "Rafsan",
  initials: "RR",
  role: "Full-Stack Web Developer",
  roles: [
    "Full-Stack Web Developer",
    "E-commerce Specialist",
    "SEO & Growth",
  ],
  title: "Full Stack Developer & Head of E-Commerce",
  email: "rafsanraiyan00@gmail.com",
  phone: "+880 1601415105",
  phoneHref: "+8801601415105",
  whatsapp: "8801601415105",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  timezoneLabel: "UTC+6",
  availability: "Open to remote, on-site & relocation",
  yearsExperience: "3+",
  photo: "/rafsan-portrait.jpg",
  /** Optional short loop for the retro-TV hero screen. Drop an .mp4 into /public and point this at it. */
  heroVideo: "" as string,
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rafsan-raiyan/", handle: "in/rafsan-raiyan" },
    { label: "GitHub", href: "https://github.com/rafsanraiyan1523", handle: "@rafsanraiyan1523" },
    { label: "Email", href: "mailto:rafsanraiyan00@gmail.com", handle: "rafsanraiyan00@gmail.com" },
  ],
} as const;

export const summary =
  "Full-stack developer and e-commerce manager with 3+ years of experience shipping production platforms — from full-stack engineering in Next.js, Laravel and Django to e-commerce ownership across WordPress/WooCommerce and Shopify — with measurable growth outcomes throughout.";

export const summaryLong =
  "A full-stack builder at the core, now leading e-commerce operations end-to-end — from writing the code to running the department — while driving 65% organic traffic growth, 30% conversion rate uplift, and 45% Core Web Vitals improvement at a live production store. I combine hands-on full-stack development with technical SEO, CRO, and growth strategy to own the full cycle from deployment to revenue impact.";

/* ------------------------------------------------------------------ */
/*  Impact metrics                                                     */
/* ------------------------------------------------------------------ */

export const metrics = [
  {
    value: 65,
    suffix: "%",
    label: "Organic traffic growth",
    detail: "Technical SEO, schema markup and content architecture on a live production store.",
  },
  {
    value: 30,
    suffix: "%",
    label: "Conversion rate uplift",
    detail: "Checkout optimisation and UX enhancements across the WooCommerce funnel.",
  },
  {
    value: 45,
    suffix: "%",
    label: "Core Web Vitals boost",
    detail: "LCP, CLS and INP improved via minification, lazy loading, CDN and critical CSS.",
  },
  {
    value: 20,
    suffix: "%",
    label: "Average order value",
    detail: "Merchandising, cross-sell, wishlist and personalised recommendations.",
  },
] as const;

export const heroStats = [
  { value: "3+", label: "Years shipping" },
  { value: "20+", label: "Client projects" },
  { value: "500K+", label: "Records processed" },
  { value: "99.8%", label: "Data integrity" },
] as const;

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

export const services = [
  {
    id: "full-stack",
    number: "01",
    title: "Full-Stack Development",
    blurb:
      "Production applications from database schema to deployed interface — built to be fast, typed and maintainable.",
    points: ["Next.js & React", "Laravel & Django", "REST APIs, JWT & OAuth", "MySQL & Supabase"],
  },
  {
    id: "ecommerce",
    number: "02",
    title: "E-Commerce Engineering",
    blurb:
      "WooCommerce and Shopify stores that actually sell — custom themes, plugins, checkout flows and merchandising systems.",
    points: ["WooCommerce & Shopify", "Custom themes & plugins", "Checkout optimisation", "AOV & cross-sell systems"],
  },
  {
    id: "seo",
    number: "03",
    title: "Technical SEO & CRO",
    blurb:
      "The engineering half of growth: Core Web Vitals, crawlability, structured data and experiments that move revenue.",
    points: ["Core Web Vitals", "Schema markup & RankMath", "A/B testing", "Funnel & CRO analysis"],
  },
  {
    id: "data",
    number: "04",
    title: "Data & Automation",
    blurb:
      "Reporting pipelines, dashboards and scripts that remove manual work and put decisions in front of leadership faster.",
    points: ["Apps Script automation", "GA4 & Tag Manager", "Power BI dashboards", "Data validation at scale"],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Selected work                                                      */
/* ------------------------------------------------------------------ */

export type Project = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  stack: readonly string[];
  results: readonly { value: string; label: string }[];
  accent: string;
  ink: string;
  links?: readonly { label: string; href: string }[];
  /** Real product screenshot — falls back to the abstract ProjectVisual mockup when absent. */
  image?: string;
  /** The image's actual pixel size, so it renders at its own aspect ratio — never cropped. */
  imageSize?: readonly [width: number, height: number];
};

export const projects: readonly Project[] = [
  {
    id: "assignment-hub",
    name: "Assignment Hub",
    category: "Full-stack assignment management system",
    tagline: "Assignments and submissions, organized in one place",
    description:
      "A clean-architecture LMS for schools — role-based workspaces for admins, teachers and students, with a draft-to-publish workflow and deadlines, marks and feedback enforced server-side, not just in the UI.",
    stack: ["Next.js", "ASP.NET Core", "PostgreSQL", "TypeScript"],
    results: [
      { value: "3", label: "Role-based workspaces" },
      { value: "RBAC", label: "Server-enforced access" },
      { value: "Full", label: "Draft-to-grading flow" },
    ],
    accent: "#6366F1",
    ink: "#ffffff",
    links: [
      { label: "Source", href: "https://github.com/rafsanraiyan1523/Assignment-Hub" },
    ],
    image: "/projects/assignment-hub.png",
    imageSize: [1912, 861],
  },
  {
    id: "deshi-bideshi",
    name: "Deshi-Bideshi Kitchen",
    category: "Full-stack food platform",
    tagline: "SSR food ordering, scoring 95+ on Lighthouse",
    description:
      "An SSR-optimised food ordering platform with a dynamic menu, image gallery and mobile-first layout — engineered for sub-1.5s loads on mid-tier devices.",
    stack: ["Next.js", "React", "Tailwind CSS", "SSR"],
    results: [
      { value: "95+", label: "Lighthouse score" },
      { value: "<1.5s", label: "Load time" },
      { value: "100%", label: "Mobile-first" },
    ],
    accent: "#FF6B4A",
    ink: "#0d0d0f",
    links: [{ label: "Source", href: "https://github.com/rafsanraiyan1523/deshi_bideshi" }],
    image: "/projects/deshi-bideshi.png",
    imageSize: [1407, 745],
  },
  {
    id: "r3-studio",
    name: "R3 Studio",
    category: "Digital growth agency platform",
    tagline: "A growth agency platform that scaled to 20+ delivered projects",
    description:
      "Built and launched a digital growth agency platform offering web development, SEO, Meta Ads and mobile app services — featuring an interactive investment estimator, client project showcase and WhatsApp-integrated lead capture.",
    stack: ["React", "Tailwind CSS", "Lead capture", "WhatsApp API"],
    results: [
      { value: "20+", label: "Client projects" },
      { value: "4", label: "Service lines" },
      { value: "1", label: "Investment estimator" },
    ],
    accent: "#7C6BFF",
    ink: "#ffffff",
    links: [{ label: "Live site", href: "https://r3-studio.vercel.app/" }],
    image: "/projects/r3-studio.png",
    imageSize: [767, 856],
  },
  {
    id: "e-lectronix",
    name: "E-LECTRONIX",
    category: "Full-stack e-commerce store",
    tagline: "A complete store architecture, built from scratch",
    description:
      "Architected an entire storefront: role-based authentication, product catalogue, cart, order tracking, payment integration and an admin dashboard — all on a hand-rolled Laravel stack.",
    stack: ["Laravel", "MySQL", "Bootstrap", "Eloquent ORM"],
    results: [
      { value: "6", label: "Core modules" },
      { value: "RBAC", label: "Auth model" },
      { value: "Full", label: "Admin dashboard" },
    ],
    accent: "#2ED3B7",
    ink: "#0d0d0f",
    links: [{ label: "Source", href: "https://github.com/rafsanraiyan1523/E-Lectronix" }],
  },
  {
    id: "enrollment",
    name: "Student Enrollment System",
    category: "Academic management system",
    tagline: "Enrollment analytics for institutional planning",
    description:
      "An enrollment platform with graph analytics and interactive dashboards, built to support data-driven institutional planning and reporting.",
    stack: ["PHP", "MySQL", "Role-based access", "Analytics"],
    results: [
      { value: "Graph", label: "Analytics engine" },
      { value: "Multi", label: "Role access" },
      { value: "Live", label: "Dashboards" },
    ],
    accent: "#FFB020",
    ink: "#0d0d0f",
    links: [{ label: "Source", href: "https://github.com/rafsanraiyan23/database_management" }],
  },
  {
    id: "post-office",
    name: "Post Office Management",
    category: "Operations management system",
    tagline: "Postal operations, streamlined into one workflow",
    description:
      "A postal operations system featuring role-based login, file management and transaction visualisations designed to streamline daily branch workflows.",
    stack: ["PHP", "MySQL", "Transaction reports"],
    results: [
      { value: "RBAC", label: "Secure login" },
      { value: "Files", label: "Document mgmt" },
      { value: "Visual", label: "Transaction reports" },
    ],
    accent: "#4A9BFF",
    ink: "#0d0d0f",
    links: [{ label: "Source", href: "https://github.com/rafsanraiyan23/PostOffice" }],
  },
];

/* ------------------------------------------------------------------ */
/*  Experience                                                         */
/* ------------------------------------------------------------------ */

export const experience = [
  {
    company: "Go Go Gorgeous",
    url: "https://gogogorgeous.com.bd/",
    role: "Full Stack Developer & Head of E-Commerce",
    period: "01/2025 — Present",
    start: "2025",
    location: "Dhaka, Bangladesh",
    current: true,
    highlights: [
      "Managed and optimised the WooCommerce platform, improving user experience and contributing to a 30% increase in conversion rate through website enhancements and checkout optimisation.",
      "Boosted Core Web Vitals scores by 45% (LCP, CLS, INP) via asset minification, lazy loading, CDN setup and critical CSS delivery — cutting bounce rate by 18%.",
      "Increased Average Order Value by 20% through strategic product merchandising, cross-selling initiatives, wishlist implementation and personalised product recommendations.",
      "Directed day-to-day digital operations — site management, campaign execution and cross-team coordination across design, marketing and fulfilment.",
      "Collaborated with marketing to build seasonal campaign pages and banners, raising CTR by 22%.",
      "Researched, tested and implemented new e-commerce tools and features to support business growth and conversion optimisation.",
    ],
  },
  {
    company: "Quantanite Bangladesh",
    url: "https://www.quantanite.com/",
    role: "Data Analyst & Automation Specialist",
    period: "11/2023 — 12/2024",
    start: "2023",
    location: "Dhaka, Bangladesh",
    current: false,
    highlights: [
      "Automated 8 reporting pipelines with Google Sheets Apps Script, reducing cycle time by 20% and eliminating manual errors.",
      "Validated and transformed 500K+ structured records, achieving 99.8% data integrity across client deliverables.",
      "Deployed 5 interactive KPI dashboards with charts, trend lines and drill-down filters that accelerated leadership decisions.",
      "Operated across BD–UK time zones through async-first communication, consistently meeting international deadlines.",
    ],
  },
  {
    company: "Appnap Technologies Limited",
    url: "https://appnap.io/",
    role: "Web Developer Intern",
    period: "06/2023 — 11/2023",
    start: "2023",
    location: "Dhaka, Bangladesh",
    current: false,
    highlights: [
      "Delivered 4 cross-browser responsive web applications in Laravel, HTML5, CSS3 and Bootstrap.",
      "Built 6 custom Laravel modules and integrated 3 third-party REST APIs (payment, SMS, mapping), cutting manual overhead by 35%.",
      "Completed BCC EDGE certification in PHP & Laravel, managed by IIT, University of Dhaka.",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Process                                                            */
/* ------------------------------------------------------------------ */

export const process = [
  {
    step: "01",
    title: "Discover & Audit",
    blurb:
      "I start with the data — analytics, Search Console, Core Web Vitals and the funnel — to find where the revenue is actually leaking.",
    deliverables: ["Technical audit", "Funnel analysis", "Priority backlog"],
  },
  {
    step: "02",
    title: "Architect",
    blurb:
      "Schema, routes, components and integrations planned before a line of production code — so the build stays fast and the codebase stays sane.",
    deliverables: ["Data model", "Component plan", "Integration map"],
  },
  {
    step: "03",
    title: "Build & Ship",
    blurb:
      "Typed, responsive, accessible front-ends on top of well-tested APIs. Deployed with CI, CDN and monitoring from day one.",
    deliverables: ["Production codebase", "CMS integration", "Deploy pipeline"],
  },
  {
    step: "04",
    title: "Optimise & Grow",
    blurb:
      "Launch is the start. Technical SEO, CRO experiments and performance work compound the result month over month.",
    deliverables: ["CRO experiments", "SEO roadmap", "Performance report"],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Skills                                                             */
/* ------------------------------------------------------------------ */

export const skills = [
  {
    group: "Languages",
    items: ["PHP", "JavaScript ES6+", "Python", "HTML5", "CSS3", "SQL"],
  },
  {
    group: "Front-End",
    items: ["Next.js", "React", "Tailwind CSS", "Bootstrap", "Responsive Design"],
  },
  {
    group: "Back-End",
    items: ["Laravel", "Django", "REST API", "JWT", "OAuth", "Eloquent ORM", "Composer", "Webhooks"],
  },
  {
    group: "WordPress & Shopify",
    items: ["Custom Theme Design", "Plugin Development", "WooCommerce", "Shopify", "Elementor"],
  },
  {
    group: "Database",
    items: ["MySQL", "Supabase", "Query Optimization", "Indexing", "Migrations", "Relational Design"],
  },
  {
    group: "SEO & Growth",
    items: ["Technical SEO", "On-Page SEO", "Core Web Vitals", "Schema Markup", "RankMath", "YouTube SEO", "CRO", "A/B Testing"],
  },
  {
    group: "Analytics",
    items: ["Google Analytics 4", "Search Console", "Google Tag Manager", "Funnel Analysis", "Power BI", "Apps Script"],
  },
  {
    group: "DevOps & Tools",
    items: ["Git", "GitHub", "Vercel", "Linux CLI", "cPanel", "VS Code", "Figma", "Canva", "Slack"],
  },
  {
    group: "Soft Skills",
    items: [
      "Cross-functional Collaboration",
      "Async Remote Work",
      "Stakeholder Communication",
      "Data-Driven Decision Making",
      "Agile/Scrum",
    ],
  },
] as const;

/** Flat list used by the hero / footer marquees. */
export const stackMarquee = [
  "Next.js",
  "React",
  "TypeScript",
  "Laravel",
  "Django",
  "PHP",
  "Python",
  "Tailwind CSS",
  "MySQL",
  "Supabase",
  "WooCommerce",
  "Shopify",
  "WordPress",
  "REST API",
  "GA4",
  "Google Tag Manager",
  "Power BI",
  "Vercel",
  "Git",
  "Figma",
] as const;

/* ------------------------------------------------------------------ */
/*  Education, research & credentials                                  */
/* ------------------------------------------------------------------ */

export const education = [
  {
    period: "2019 — 2023",
    qualification: "B.Sc. in Computer Science & Engineering",
    institution: "Independent University, Bangladesh",
    location: "Dhaka, Bangladesh",
  },
  {
    period: "2016 — 2018",
    qualification: "Higher Secondary Certificate (HSC) — Science",
    institution: "Bangladesh Navy School & College",
    location: "Khulna, Bangladesh",
  },
  {
    period: "2009 — 2016",
    qualification: "Secondary School Certificate (SSC) — Science",
    institution: "Pirojpur Govt. High School",
    location: "Pirojpur, Bangladesh",
  },
] as const;

export const credentials = [
  {
    period: "2023",
    issuer: "IEEE CS Publication",
    title: "AI Chatbot: An Interactive Model for Human-Robot Interaction",
    detail:
      "Undergraduate NLP and conversational AI research, published under IEEE Computer Society academic activities. Supervised by Asst. Prof. AKM Mahbubur Rahman, Dept. of CSE, IUB.",
    tag: "Research",
    href: "https://drive.google.com/file/d/1lWvVkujKqGY3lPZ_se2wr8D7gtLFa0y0/view",
  },
  {
    period: "Jun — Sep 2023",
    issuer: "BCC EDGE / IIT, Univ. of Dhaka",
    title: "Web Development with PHP & Laravel",
    detail:
      "ICT Division, Bangladesh Computer Council (BCC) EDGE — Hire and Train Program. Organised by Appnap Technologies Limited.",
    tag: "Certification",
    href: "https://drive.google.com/file/d/1kSXflLbDKOlqKLhXt6rE_N-6bkGfEqLU/view",
  },
] as const;

export const additional = {
  languages: [
    { name: "Bangla", level: "Native" },
    { name: "English", level: "Professional — reading, writing, spoken" },
  ],
  memberships: ["IEEE Computer Society — General Member"],
  activities: ["AmariSchool Campus Ambassador — student outreach and community engagement"],
} as const;

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: "What kind of work are you looking for?",
    a: "Full-stack development roles and e-commerce manager roles, equally — remote, on-site or relocation. I’m based in Dhaka (UTC+6) and have spent a year working async across BD–UK time zones, so distributed teams are familiar territory too.",
  },
  {
    q: "What does your stack actually look like?",
    a: "Next.js and React on the front, Laravel or Django on the back, MySQL or Supabase underneath. On the commerce side, WooCommerce and Shopify with custom themes and plugins. Deployment through Vercel, cPanel or plain Linux, with Git throughout.",
  },
  {
    q: "You lead e-commerce and write code — how does that work?",
    a: "It’s the same job from two angles. I run the department — operations, campaigns, cross-team coordination — and I’m also the one shipping the theme changes, checkout optimisations and performance fixes. Nothing gets lost in translation between strategy and implementation.",
  },
  {
    q: "Can you take on SEO and performance work on its own?",
    a: "Yes. Technical SEO, Core Web Vitals, schema markup and CRO experiments are a standalone engagement I run regularly — most recently driving 65% organic traffic growth and a 45% Core Web Vitals improvement on a live store.",
  },
  {
    q: "How do you handle data and reporting?",
    a: "I’ve automated 8 reporting pipelines with Apps Script, validated 500K+ structured records at 99.8% integrity, and built 5 interactive KPI dashboards. GA4, Search Console, Tag Manager and Power BI are part of the standard kit.",
  },
  {
    q: "What’s the fastest way to reach you?",
    a: "Email at rafsanraiyan00@gmail.com, or the form below — either lands in the same inbox. I reply within a working day, usually sooner.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
] as const;
