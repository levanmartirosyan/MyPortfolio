import { handleApiError, ok, requireAdmin } from "@/server/http";
import { deleteExperience, upsertExperience } from "@/server/portfolio/repository";
import { experienceSchema } from "@/server/portfolio/validators";
import { revalidatePortfolio } from "@/server/revalidate";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const saved = await upsertExperience(experienceSchema.parse({ ...(await request.json()), id }));
    revalidatePortfolio();
    return ok(saved);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    await deleteExperience(id);
    revalidatePortfolio();
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
