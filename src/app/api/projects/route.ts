import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, upsertProject } from "@/server/portfolio/repository";
import { projectSchema } from "@/server/portfolio/validators";
import { revalidatePortfolio } from "@/server/revalidate";

export async function GET() {
  try {
    return ok((await getPortfolioData()).projects);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const saved = await upsertProject(projectSchema.parse(await request.json()));
    revalidatePortfolio();
    return ok(saved);
  } catch (error) {
    return handleApiError(error);
  }
}
