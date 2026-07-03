import { clearAdminSession } from "@/server/auth";
import { ok } from "@/server/http";

export async function POST() {
  await clearAdminSession();
  return ok({ authenticated: false });
}
