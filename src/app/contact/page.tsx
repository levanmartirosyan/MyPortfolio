import { SiteLayout } from "@/components/site/SiteLayout";
import ContactPage from "@/routes/contact";
import { getPortfolioData } from "@/server/portfolio/repository";

export const revalidate = 60;

export default async function Page() {
  const { profile, social } = await getPortfolioData();
  return (
    <SiteLayout profile={profile} social={social}>
      <ContactPage social={social} />
    </SiteLayout>
  );
}
