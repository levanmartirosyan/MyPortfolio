"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, X, ExternalLink, Github, Sparkles, ArrowUpRight, Star } from "lucide-react";
import { Section } from "@/components/site/LayoutPrimitives";
import { TechBadge } from "@/components/site/TechBadge";
import type { Project } from "@/server/portfolio/types";

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [open, setOpen] = useState<Project | null>(null);

  const tags = useMemo(() => {
    const values = new Set<string>();
    projects.forEach((project) => project.tech.forEach((tech) => values.add(tech)));
    return Array.from(values).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return projects
      .slice()
      .sort((a, b) => a.order - b.order)
      .filter((project) => {
        const matchQ =
          !query ||
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query);
        const matchTag = !tag || project.tech.includes(tag);
        return matchQ && matchTag;
      });
  }, [projects, q, tag]);

  return (
    <>
      <Section className="pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
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
            {tags.map((tech) => (
              <button
                key={tech}
                onClick={() => setTag(tech === tag ? null : tech)}
                className={`rounded-full px-3 py-1 text-xs transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                  tech === tag
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-6 w-6 text-primary" />
            {projects.length === 0 ? "No projects yet." : "No projects match those filters."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <InteractiveProjectCard key={project.id} project={project} onOpen={setOpen} />
            ))}
          </div>
        )}
      </Section>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function InteractiveProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <article className="card-hover glow-border group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-surface to-background">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ProjectInitials name={project.name} />
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium text-primary ring-1 ring-primary/40 backdrop-blur">
            <Star className="h-3 w-3 fill-primary" /> Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold">{project.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tech.slice(0, 5).map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
              >
                <ArrowUpRight className="h-3.5 w-3.5" /> Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
              >
                <Github className="h-3.5 w-3.5" /> Code
              </a>
            )}
          </div>
          <button
            onClick={() => onOpen(project)}
            className="text-xs font-medium text-primary transition-all duration-300 ease-out hover:-translate-y-0.5 hover:underline"
          >
            View details
          </button>
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-fade-up glow-border relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/60 bg-card p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-background">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          ) : (
            <ProjectInitials name={project.name} large />
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
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
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

function ProjectInitials({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className={`font-mono font-bold text-primary/40 ${large ? "text-6xl" : "text-4xl"}`}>
        {name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 3)}
      </div>
    </div>
  );
}
