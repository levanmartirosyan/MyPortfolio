import ExperiencePage from "@/routes/experience";
import { getPortfolioData } from "@/server/portfolio/repository";

export const revalidate = 60;

export default async function Page() {
  const { experiences } = await getPortfolioData();
  return <ExperiencePage experiences={experiences} />;
}
