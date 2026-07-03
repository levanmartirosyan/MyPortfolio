import { Section, Eyebrow } from "@/components/site/LayoutPrimitives";
import type { Project } from "@/server/portfolio/types";
import { ProjectsBrowser } from "./projects-browser";

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  return (
    <>
      <Section className="pb-12 pt-16">
        <Eyebrow>Portfolio</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Projects</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A selection of things I've designed and shipped - SaaS platforms, real-time apps,
          developer tools.
        </p>
      </Section>

      <ProjectsBrowser projects={projects} />
    </>
  );
}
