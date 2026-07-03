import { handleApiError, ok, requireAdmin } from "@/server/http";
import { deleteProject, upsertProject } from "@/server/portfolio/repository";
import { projectSchema } from "@/server/portfolio/validators";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    return ok(await upsertProject(projectSchema.parse({ ...(await request.json()), id })));
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
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
