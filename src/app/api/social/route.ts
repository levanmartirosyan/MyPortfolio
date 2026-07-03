import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, saveSocial } from "@/server/portfolio/repository";
import { socialSchema } from "@/server/portfolio/validators";

export async function GET() {
  try {
    return ok((await getPortfolioData()).social);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    return ok(await saveSocial(socialSchema.parse(await request.json())));
  } catch (error) {
    return handleApiError(error);
  }
}
