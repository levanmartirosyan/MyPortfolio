import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";

const groups: { title: string; accent: string; items: { name: string; level: number }[] }[] = [
  {
    title: "Frontend",
    accent: "from-fuchsia-500/40 to-purple-500/10",
    items: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Angular", level: 80 },
      { name: "TypeScript", level: 95 },
      { name: "Tailwind CSS", level: 92 },
    ],
  },
  {
    title: "Backend",
    accent: "from-violet-500/40 to-indigo-500/10",
    items: [
      { name: ".NET 8 / ASP.NET Core", level: 95 },
      { name: "C#", level: 95 },
      { name: "EF Core", level: 90 },
      { name: "Node.js", level: 78 },
      { name: "REST & GraphQL", level: 85 },
    ],
  },
  {
    title: "Databases",
    accent: "from-cyan-500/40 to-blue-500/10",
    items: [
      { name: "PostgreSQL", level: 90 },
      { name: "SQL Server", level: 85 },
      { name: "Redis", level: 75 },
      { name: "Elasticsearch", level: 65 },
    ],
  },
  {
    title: "DevOps",
    accent: "from-emerald-500/40 to-teal-500/10",
    items: [
      { name: "Docker", level: 88 },
      { name: "GitHub Actions", level: 85 },
      { name: "Azure", level: 78 },
      { name: "Nginx", level: 70 },
    ],
  },
  {
    title: "Tools",
    accent: "from-pink-500/40 to-rose-500/10",
    items: [
      { name: "Git", level: 95 },
      { name: "Figma", level: 75 },
      { name: "Postman", level: 90 },
      { name: "Rider / VS Code", level: 95 },
    ],
  },
];

export default function SkillsPage() {
  return (
    <SiteLayout>
      <Section className="pb-12 pt-16">
        <Eyebrow>Stack</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Skills & tools</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          What I reach for. I optimize for boring, reliable tech until the problem asks for more.
        </p>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div
              key={g.title}
              className={`glow-border card-hover relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${g.accent} opacity-30`}
              />
              <div className="relative">
                <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((it) => (
                    <li key={it.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{it.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{it.level}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-neon-soft"
                          style={{ width: `${it.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
