import { SiteLayout } from "@/components/site/SiteLayout";
import ProjectsPage from "@/routes/projects";
import { getPortfolioData } from "@/server/portfolio/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { projects } = await getPortfolioData();
  return (
    <SiteLayout>
      <ProjectsPage projects={projects} />
    </SiteLayout>
  );
}
