import Home from "@/routes/index";
import { getPortfolioData } from "@/server/portfolio/repository";

export const revalidate = 60;

export default async function Page() {
  const { profile, projects } = await getPortfolioData();
  return <Home profile={profile} projects={projects} />;
}
