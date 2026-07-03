import { handleApiError, ok, requireAdmin } from "@/server/http";
import { getPortfolioData } from "@/server/portfolio/repository";

export async function GET(request: Request) {
  try {
    const includeMessages = new URL(request.url).searchParams.get("includeMessages") === "true";
    if (includeMessages) {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;
    }
    return ok(await getPortfolioData(includeMessages));
  } catch (error) {
    return handleApiError(error);
  }
}
