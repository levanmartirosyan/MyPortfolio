import { z } from "zod";
import { deleteMessage, updateMessageRead } from "@/server/portfolio/repository";
import { handleApiError, ok, requireAdmin } from "@/server/http";

const patchSchema = z.object({
  read: z.boolean(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    return ok(await updateMessageRead(id, patchSchema.parse(await request.json()).read));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    await deleteMessage(id);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
