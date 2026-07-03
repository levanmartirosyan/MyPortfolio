import Image from "next/image";
import { Download, GraduationCap, Rocket, Wrench } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { TechBadge } from "@/components/site/TechBadge";
import type { Profile } from "@/server/portfolio/types";

const skills = {
  Backend: [".NET", "ASP.NET Core", "C#", "EF Core", "Redis", "SignalR", "REST APIs", "JWT Auth"],
  Frontend: ["React", "Next.js", "Angular", "TypeScript", "Tailwind CSS"],
  Data: ["PostgreSQL", "SQL Server", "Redis"],
  DevOps: ["Docker", "GitHub Actions", "Azure"],
};

const journey = [
  {
    icon: GraduationCap,
    title: "Started programming",
    period: "Early days",
    text: "Fell in love with building things you can click on. Learned C#, then never really stopped.",
  },
  {
    icon: Wrench,
    title: "Full-stack in production",
    period: "Team & studio work",
    text: "Shipped enterprise dashboards and internal tools. Learned to care about DX, testing and deploys.",
  },
  {
    icon: Rocket,
    title: "Freelance & product work",
    period: "Now",
    text: "Independent engineer working with founders and small teams to design and build modern web products.",
  },
];

export default function AboutPage({ profile }: { profile: Profile }) {
  const hasProfile = Boolean(profile.name.trim() || profile.about.trim());

  return (
    <SiteLayout profile={profile}>
      <Section className="pb-20 pt-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Eyebrow>About me</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              {hasProfile ? "I build software the way I'd want to use it." : "No profile data yet."}
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              {hasProfile
                ? profile.about
                : "Add your about text in the admin panel to publish this page."}
            </p>
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/20"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
          </div>
          <div className="relative hidden aspect-square w-52 shrink-0 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/30 via-surface to-background md:block">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                sizes="208px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center font-display text-6xl font-bold text-primary">
                {profile.name.slice(0, 1) || "LM"}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="pb-20">
        <h2 className="font-display text-2xl font-semibold">Skills & technologies</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(skills).map(([cat, list]) => (
            <div
              key={cat}
              className="glow-border card-hover rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-primary">{cat}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {list.map((s) => (
                  <TechBadge key={s}>{s}</TechBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <h2 className="font-display text-2xl font-semibold">The work I like</h2>
        <ul className="mt-4 grid gap-2 text-muted-foreground">
          <li>· Greenfield products where architecture actually matters.</li>
          <li>· Rescuing legacy systems and dragging them into the present.</li>
          <li>· Design-first internal tools that people are happy to open.</li>
          <li>· Anything real-time, data-heavy, or performance-sensitive.</li>
        </ul>
      </Section>

      <Section className="pb-24">
        <h2 className="font-display text-2xl font-semibold">Journey</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {journey.map((j, i) => (
            <div
              key={j.title}
              className="glow-border card-hover relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                <j.icon className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{j.period}</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{j.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{j.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
