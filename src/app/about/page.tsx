import AboutPage from "@/routes/about";
import { getPortfolioData } from "@/server/portfolio/repository";

export const revalidate = 60;

export default async function Page() {
  const { profile } = await getPortfolioData();
  return <AboutPage profile={profile} />;
}
