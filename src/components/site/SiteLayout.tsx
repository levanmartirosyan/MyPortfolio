import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { Profile, Social } from "@/server/portfolio/types";
export { Eyebrow, Section } from "./LayoutPrimitives";

export async function SiteLayout({
  children,
  profile,
  social,
}: {
  children: ReactNode;
  profile?: Profile;
  social?: Social;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px] bg-hero-glow" />
      <Navbar profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} social={social} />
    </div>
  );
}
