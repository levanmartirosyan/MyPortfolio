import { isAdminAuthenticated } from "@/server/auth";
import { ok } from "@/server/http";

export async function GET() {
  return ok({ authenticated: await isAdminAuthenticated() });
}
