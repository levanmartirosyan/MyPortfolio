import { getPortfolioData } from "@/server/portfolio/repository";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const { profile } = await getPortfolioData();
  return <NavbarClient name={profile.name} />;
}
