import type { ReactNode } from "react";

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
      <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
      {children}
    </div>
  );
}
