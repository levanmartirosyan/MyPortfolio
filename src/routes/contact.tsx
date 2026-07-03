"use client";

import { useState } from "react";
import { z } from "zod";
import { Github, Linkedin, Mail, Send, CheckCircle2, MapPin } from "lucide-react";
import { Section, Eyebrow } from "@/components/site/LayoutPrimitives";
import type { Social } from "@/server/portfolio/types";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.string().trim().min(1, "Subject is required").max(120),
  message: z.string().trim().min(10, "Say a little more (min 10 chars)").max(2000),
});

export default function ContactPage({ social }: { social: Social }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        setErrors({ form: "Message could not be sent. Please try again." });
        return;
      }

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  }

  const cards = [
    { icon: Mail, label: "Email", value: social.email, href: `mailto:${social.email}` },
    { icon: Linkedin, label: "LinkedIn", value: "Connect", href: social.linkedin },
    { icon: Github, label: "GitHub", value: "Follow", href: social.github },
  ].filter((c) => c.value);

  return (
    <>
      <Section className="pb-12 pt-16">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Let's talk.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Roles, freelance projects, collaborations — I read everything and reply within a day.
        </p>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={onSubmit}
            className="glow-border rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="Your name"
                  maxLength={80}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="you@company.com"
                  maxLength={160}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Subject" error={errors.subject}>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input"
                  placeholder="Project inquiry, role, collaboration..."
                  maxLength={120}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Message" error={errors.message}>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input min-h-[160px] resize-y"
                  placeholder="Tell me a bit about what you're building..."
                  maxLength={2000}
                />
              </Field>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/70 px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
            >
              {submitting ? "Sending..." : "Send message"} <Send className="h-4 w-4" />
            </button>
            {errors.form && <p className="mt-3 text-sm text-destructive">{errors.form}</p>}
            {sent && (
              <div className="animate-fade-up mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" /> Thanks — I'll get back to you soon.
              </div>
            )}
          </form>

          <div className="space-y-3">
            {cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="glow-border card-hover flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="truncate font-medium">{c.value}</p>
                </div>
              </a>
            ))}
            <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              <div className="mb-2 inline-flex items-center gap-2 text-primary">
                <MapPin className="h-4 w-4" /> Availability
              </div>
              Open to remote roles worldwide and freelance projects. Usually reply within 24h.
            </div>
          </div>
        </div>
      </Section>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          background: color-mix(in oklch, var(--surface) 60%, transparent);
          border: 1px solid var(--color-border);
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          color: var(--color-foreground);
        }
        .input::placeholder { color: color-mix(in oklch, var(--color-muted-foreground) 80%, transparent); }
        .input:focus {
          border-color: color-mix(in oklch, var(--color-primary) 60%, transparent);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-primary) 15%, transparent);
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
