"use client";

import { useMemo, useState } from "react";
import { Search, X, ExternalLink, Github, Sparkles } from "lucide-react";
import { Section, Eyebrow } from "@/components/site/LayoutPrimitives";
import { ProjectCard } from "@/components/site/ProjectCard";
import { TechBadge } from "@/components/site/TechBadge";
import type { Project } from "@/server/portfolio/types";

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [open, setOpen] = useState<Project | null>(null);

  const tags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => p.tech.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects
      .slice()
      .sort((a, b) => a.order - b.order)
      .filter((p) => {
        const matchQ =
          !q ||
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase());
        const matchTag = !tag || p.tech.includes(tag);
        return matchQ && matchTag;
      });
  }, [projects, q, tag]);

  return (
    <>
      <Section className="pb-16 pt-16">
        <Eyebrow>Portfolio</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Projects</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A selection of things I've designed and shipped — SaaS platforms, real-time apps,
          developer tools.
        </p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-full border border-border bg-surface/60 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTag(null)}
              className={`rounded-full px-3 py-1 text-xs transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                !tag
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t === tag ? null : t)}
                className={`rounded-full px-3 py-1 text-xs transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                  t === tag
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-6 w-6 text-primary" />
            No projects match those filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setOpen} />
            ))}
          </div>
        )}
      </Section>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up glow-border relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/60 bg-card p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-background">
          {project.image ? (
            <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center font-mono text-6xl text-primary/40">
              {project.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 3)}
            </div>
          )}
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">{project.name}</h2>
        <p className="mt-2 text-muted-foreground">{project.description}</p>

        {project.longDescription && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {project.longDescription}
          </p>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Key features</h3>
            <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-muted-foreground sm:grid-cols-2">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <TechBadge key={t}>{t}</TechBadge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
            >
              <ExternalLink className="h-4 w-4" /> Live site
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
