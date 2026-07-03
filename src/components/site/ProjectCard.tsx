import Image from "next/image";
import { ArrowUpRight, Github, Star } from "lucide-react";
import type { Project } from "@/server/portfolio/types";
import { TechBadge } from "./TechBadge";

export function ProjectCard({ project }: { project: Project }) {
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
          <div className="grid h-full w-full place-items-center">
            <div className="font-mono text-4xl font-bold text-primary/40">
              {project.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 3)}
            </div>
          </div>
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
        <div className="flex items-center gap-3 pt-2">
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
      </div>
    </article>
  );
}
