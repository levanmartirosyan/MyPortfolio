export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary">
      {children}
    </span>
  );
}
