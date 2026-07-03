import AboutPage from "@/routes/about";
import { getPortfolioData } from "@/server/portfolio/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { profile } = await getPortfolioData();
  return <AboutPage profile={profile} />;
}
