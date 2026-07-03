import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export { Eyebrow, Section } from "./LayoutPrimitives";

export async function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px] bg-hero-glow" />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
