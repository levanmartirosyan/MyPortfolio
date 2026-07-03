import { createAdminSession, verifyLogin } from "@/server/auth";
import { handleApiError, ok, problem } from "@/server/http";
import { loginSchema } from "@/server/portfolio/validators";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    if (!verifyLogin(body.username, body.password)) {
      return problem("Invalid credentials", 401);
    }

    await createAdminSession();
    return ok({ authenticated: true });
  } catch (error) {
    return handleApiError(error);
  }
}
