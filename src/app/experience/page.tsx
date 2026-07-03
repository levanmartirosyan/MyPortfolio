import ExperiencePage from "@/routes/experience";
import { getPortfolioData } from "@/server/portfolio/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { experiences } = await getPortfolioData();
  return <ExperiencePage experiences={experiences} />;
}
