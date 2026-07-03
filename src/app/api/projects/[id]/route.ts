import { handleApiError, ok, requireAdmin } from "@/server/http";
import { deleteProject, upsertProject } from "@/server/portfolio/repository";
import { projectSchema } from "@/server/portfolio/validators";
import { revalidatePortfolio } from "@/server/revalidate";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const saved = await upsertProject(projectSchema.parse({ ...(await request.json()), id }));
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
    await deleteProject(id);
    revalidatePortfolio();
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
