import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, saveProfile } from "@/server/portfolio/repository";
import { profileSchema } from "@/server/portfolio/validators";

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
    return ok(await saveProfile(profileSchema.parse(await request.json())));
  } catch (error) {
    return handleApiError(error);
  }
}
