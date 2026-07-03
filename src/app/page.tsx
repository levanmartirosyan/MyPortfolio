import Home from "@/routes/index";
import { getPortfolioData } from "@/server/portfolio/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { profile, projects } = await getPortfolioData();
  return <Home profile={profile} projects={projects} />;
}
