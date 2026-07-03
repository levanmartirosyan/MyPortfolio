import { getPortfolioData } from "@/server/portfolio/repository";
import type { Profile } from "@/server/portfolio/types";
import { NavbarClient } from "./NavbarClient";

export async function Navbar({ profile }: { profile?: Profile }) {
  const resolvedProfile = profile ?? (await getPortfolioData()).profile;
  return <NavbarClient name={resolvedProfile.name} />;
}
