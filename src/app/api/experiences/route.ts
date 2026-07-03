import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, upsertExperience } from "@/server/portfolio/repository";
import { experienceSchema } from "@/server/portfolio/validators";

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
    return ok(await upsertExperience(experienceSchema.parse(await request.json())));
  } catch (error) {
    return handleApiError(error);
  }
}
