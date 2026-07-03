import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, upsertExperience } from "@/server/portfolio/repository";
import { experienceSchema } from "@/server/portfolio/validators";
import { revalidatePortfolio } from "@/server/revalidate";

export async function GET() {
  try {
    return ok((await getPortfolioData()).experiences);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const saved = await upsertExperience(experienceSchema.parse(await request.json()));
    revalidatePortfolio();
    return ok(saved);
  } catch (error) {
    return handleApiError(error);
  }
}
