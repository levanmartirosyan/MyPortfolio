import { SiteLayout } from "@/components/site/SiteLayout";
import ContactPage from "@/routes/contact";
import { getPortfolioData } from "@/server/portfolio/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { social } = await getPortfolioData();
  return (
    <SiteLayout>
      <ContactPage social={social} />
    </SiteLayout>
  );
}
