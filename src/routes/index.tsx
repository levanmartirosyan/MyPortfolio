import Link from "next/link";
import { ArrowRight, Download, Sparkles, Zap, Layers, ShieldCheck } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { TypingRoles } from "@/components/site/TypingRoles";
import { TechBadge } from "@/components/site/TechBadge";
import { ProjectCard } from "@/components/site/ProjectCard";
import type { Profile, Project } from "@/server/portfolio/types";

const mainStack = [
  ".NET",
  "ASP.NET Core",
  "C#",
  "React",
  "Next.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "PostgreSQL",
  "SQL Server",
  "Entity Framework Core",
  "Docker",
  "Redis",
  "SignalR",
  "REST APIs",
  "JWT Authentication",
  "Git",
  "Tailwind CSS",
];

const perks = [
  {
    icon: Zap,
    title: "Ships fast, breaks nothing",
    text: "Type-safe stacks, tested critical paths, CI/CD by default — velocity without chaos.",
  },
  {
    icon: Layers,
    title: "Owns the full stack",
    text: "From SQL indexes to pixel-perfect UI — one engineer, no hand-off friction.",
  },
  {
    icon: ShieldCheck,
    title: "Production-minded",
    text: "Auth, observability, background jobs, deployment. I care about what happens after launch.",
  },
  {
    icon: Sparkles,
    title: "Design taste",
    text: "I sweat spacing, motion and copy. Software should feel effortless, not just work.",
  },
];

export default function Home({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const hasProfile = Boolean(profile.name.trim() || profile.intro.trim());
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  return (
    <SiteLayout profile={profile}>
      {/* Hero */}
      <Section className="relative pb-24 pt-20 sm:pt-28">
        <div className="animate-fade-up mx-auto max-w-3xl text-center">
          <Eyebrow>Available for new opportunities</Eyebrow>
          {hasProfile ? (
            <>
              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                Hi, I'm <span className="text-gradient">{profile.name}</span>.
              </h1>
              {profile.intro && (
                <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  {profile.intro}
                </p>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                Currently: <TypingRoles />
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                No profile data yet.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Add your profile details in the admin panel to publish the homepage.
              </p>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/70 px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface"
            >
              Contact Me
            </Link>
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-primary"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
            {mainStack.map((t) => (
              <TechBadge key={t}>{t}</TechBadge>
            ))}
          </div>
        </div>
      </Section>

      {/* Why work with me */}
      <Section className="py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Why work with me</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            A senior mindset in a full-stack shell.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Product-focused engineering that reduces meetings and increases what you ship.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <div
              key={p.title}
              className="glow-border card-hover rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured projects */}
      <Section className="py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Featured projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm text-muted-foreground transition hover:text-primary sm:inline-flex"
          >
            All projects →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.length > 0 ? (
            featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground sm:col-span-2 lg:col-span-3">
              No featured projects yet.
            </div>
          )}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="py-24">
        <div className="glow-border relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-10 text-center backdrop-blur sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
          <div className="relative">
            <Eyebrow>Let's build</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
              Have a product to ship?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              I'm booking new projects and full-time roles. Let's talk about what you're building.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/70 px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
            >
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
