import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData, upsertProject } from "@/server/portfolio/repository";
import { projectSchema } from "@/server/portfolio/validators";

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
    return ok(await upsertProject(projectSchema.parse(await request.json())));
  } catch (error) {
    return handleApiError(error);
  }
}
