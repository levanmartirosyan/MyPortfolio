import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, saveProfile } from "@/server/portfolio/repository";
import { profileSchema } from "@/server/portfolio/validators";
import { revalidatePortfolio } from "@/server/revalidate";

export async function GET() {
  try {
    return ok((await getPortfolioData()).profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const saved = await saveProfile(profileSchema.parse(await request.json()));
    revalidatePortfolio();
    return ok(saved);
  } catch (error) {
    return handleApiError(error);
  }
}
