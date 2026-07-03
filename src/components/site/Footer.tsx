import { Github, Linkedin, Mail, Send } from "lucide-react";
import { getPortfolioData } from "@/server/portfolio/repository";

export async function Footer() {
  const { profile, social } = await getPortfolioData();
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. Built with care.
        </p>
        <div className="flex items-center gap-2">
          <SocialIcon href={social.github} label="GitHub">
            <Github className="h-4 w-4" />
          </SocialIcon>
          <SocialIcon href={social.linkedin} label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </SocialIcon>
          <SocialIcon href={`mailto:${social.email}`} label="Email">
            <Mail className="h-4 w-4" />
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
    >
      {children}
    </a>
  );
}
