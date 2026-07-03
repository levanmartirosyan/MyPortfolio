import { handleApiError, ok, requireAdmin } from "@/server/http";
import { createMessage, getPortfolioData } from "@/server/portfolio/repository";
import { messageSchema } from "@/server/portfolio/validators";

export async function GET() {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    return ok((await getPortfolioData(true)).messages);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    return ok(await createMessage(messageSchema.parse(await request.json())), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
