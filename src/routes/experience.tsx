import { Briefcase } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { TechBadge } from "@/components/site/TechBadge";
import { experienceDuration, formatMonth } from "@/lib/portfolio-utils";
import type { Experience, Profile } from "@/server/portfolio/types";

export default function ExperiencePage({
  profile,
  experiences: raw,
}: {
  profile: Profile;
  experiences: Experience[];
}) {
  const experiences = [...raw].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  return (
    <SiteLayout profile={profile}>
      <Section className="pb-12 pt-16">
        <Eyebrow>Career</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Work experience</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Roles, companies and the stack I used to build things that shipped.
        </p>
      </Section>

      <Section className="pb-24">
        <div className="relative">
          {experiences.length > 0 ? (
            <ul className="relative space-y-6">
              <span className="absolute inset-y-0 left-4 w-px bg-primary/35 md:left-6" />
              {experiences.map((e) => (
                <li key={e.id} className="relative pl-12 md:pl-16">
                  <div className="absolute left-0 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-primary/40 bg-background text-primary ring-4 ring-background md:left-2">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <article className="glow-border card-hover rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold">{e.position}</h3>
                        <p className="text-sm text-muted-foreground">{e.company}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>
                          {formatMonth(e.startDate)} —{" "}
                          {e.current ? "Present" : formatMonth(e.endDate)}
                        </p>
                        <p className="mt-0.5 text-primary">{experienceDuration(e)}</p>
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {e.description}
                    </p>
                    {e.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {e.tech.map((t) => (
                          <TechBadge key={t}>{t}</TechBadge>
                        ))}
                      </div>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No experience data yet.
            </div>
          )}
        </div>
      </Section>
    </SiteLayout>
  );
}
