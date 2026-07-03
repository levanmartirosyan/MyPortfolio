export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-hero-glow" />
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-surface-2" />
          <div className="hidden gap-2 md:flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-8 w-20 animate-pulse rounded-md bg-surface-2" />
            ))}
          </div>
          <div className="h-8 w-8 animate-pulse rounded-md bg-surface-2 md:hidden" />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-3xl">
          <div className="h-4 w-28 animate-pulse rounded-full bg-primary/30" />
          <div className="mt-5 h-12 w-4/5 animate-pulse rounded-xl bg-surface-2 sm:h-16" />
          <div className="mt-4 h-12 w-3/5 animate-pulse rounded-xl bg-surface-2 sm:h-16" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-surface-2" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-2" />
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="glow-border rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur"
            >
              <div className="aspect-video animate-pulse rounded-xl bg-surface-2" />
              <div className="mt-5 h-5 w-2/3 animate-pulse rounded-full bg-surface-2" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-surface-2" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-surface-2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
