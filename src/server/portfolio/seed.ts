import type { Experience, PortfolioData, Profile, Project, Social } from "./types";

export const defaultProfile: Profile = {
  name: "Levan",
  title: "Software Engineer - Full-Stack Developer",
  intro:
    "I design and build fast, reliable web products end-to-end - from database schema to pixel-perfect UI.",
  about:
    "I'm a full-stack software engineer focused on shipping polished, maintainable web apps. I love clean architecture, thoughtful UX, and the moment a system finally feels effortless. My daily stack spans .NET, ASP.NET Core, React, Angular, Next.js and PostgreSQL - but I choose tools that fit the problem, not my resume.",
  cvUrl: "",
  avatar: "",
};

export const defaultSocial: Social = {
  linkedin: "https://linkedin.com/in/your-handle",
  github: "https://github.com/your-handle",
  email: "hello@example.com",
  website: "",
};

export const defaultProjects: Project[] = [
  {
    id: "ledgerly-saas-accounting",
    name: "Ledgerly - SaaS Accounting",
    description: "Multi-tenant accounting platform with real-time reporting and role-based access.",
    longDescription:
      "Ledgerly is a modern accounting SaaS built with .NET 8, ASP.NET Core, and React. It supports multi-tenant workspaces, granular RBAC, real-time financial dashboards using SignalR, and PDF invoice generation. Deployed on Azure with Docker and GitHub Actions CI/CD.",
    image: "",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    tech: [".NET 8", "ASP.NET Core", "React", "PostgreSQL", "SignalR", "Docker"],
    featured: true,
    order: 1,
    features: [
      "Multi-tenant workspaces with row-level security",
      "Real-time dashboards over SignalR",
      "PDF invoicing & tax reports",
      "Stripe billing integration",
    ],
  },
  {
    id: "nimbus-team-chat",
    name: "Nimbus - Team Chat",
    description: "Slack-style team messaging with threads, presence, and file sharing.",
    longDescription:
      "Nimbus is a real-time team chat application. Backend built with ASP.NET Core + SignalR, frontend in Next.js with server components. PostgreSQL with full-text search, Redis for presence, S3-compatible storage for uploads.",
    image: "",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    tech: ["Next.js", "ASP.NET Core", "SignalR", "PostgreSQL", "Redis"],
    featured: true,
    order: 2,
    features: [
      "Threaded conversations",
      "Presence & typing indicators",
      "Full-text search",
      "File uploads",
    ],
  },
  {
    id: "orbit-crm",
    name: "Orbit CRM",
    description: "Angular + .NET CRM with pipeline automations and email sync.",
    longDescription:
      "Orbit is a modular CRM for small teams. Angular 17 SPA with a Clean Architecture .NET backend, MediatR CQRS, EF Core, and PostgreSQL. Includes email sync via IMAP, Kanban pipelines and workflow automations.",
    image: "",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    tech: ["Angular", ".NET", "EF Core", "PostgreSQL", "MediatR"],
    featured: true,
    order: 3,
    features: [
      "Kanban pipelines",
      "Email sync (IMAP)",
      "Workflow automations",
      "Clean Architecture + CQRS",
    ],
  },
  {
    id: "pulse-uptime-monitor",
    name: "Pulse - Uptime Monitor",
    description: "Distributed uptime and API monitoring with alerting.",
    longDescription:
      "Pulse monitors HTTP endpoints from multiple regions, computes uptime SLAs, and alerts via email. Built with .NET workers, PostgreSQL time-series, and a React dashboard.",
    image: "",
    githubUrl: "https://github.com",
    tech: [".NET Worker", "React", "PostgreSQL", "Docker"],
    featured: false,
    order: 4,
  },
];

export const defaultExperiences: Experience[] = [
  {
    id: "freelance-full-stack",
    company: "Freelance",
    position: "Full-Stack Software Engineer",
    startDate: "2024-01",
    current: true,
    description:
      "Building production web applications for startups and small businesses. Full lifecycle: architecture, backend APIs, frontend, CI/CD and deployment.",
    tech: [".NET 8", "ASP.NET Core", "React", "Next.js", "PostgreSQL", "Docker", "Azure"],
  },
  {
    id: "tech-studio-software-engineer",
    company: "Tech Studio (example)",
    position: "Software Engineer",
    startDate: "2022-06",
    endDate: "2023-12",
    current: false,
    description:
      "Developed and maintained enterprise dashboards, migrated legacy services to .NET 8, and led adoption of Docker + GitHub Actions across the team.",
    tech: [".NET", "Angular", "SQL Server", "Docker"],
  },
];

export const defaultPortfolioData: PortfolioData = {
  profile: defaultProfile,
  social: defaultSocial,
  projects: defaultProjects,
  experiences: defaultExperiences,
  messages: [],
};
