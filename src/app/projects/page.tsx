import { SiteLayout } from "@/components/site/SiteLayout";
import ProjectsPage from "@/routes/projects";
import { getPortfolioData } from "@/server/portfolio/repository";

export const revalidate = 60;

export default async function Page() {
  const { profile, projects } = await getPortfolioData();
  return (
    <SiteLayout profile={profile}>
      <ProjectsPage projects={projects} />
    </SiteLayout>
  );
}
