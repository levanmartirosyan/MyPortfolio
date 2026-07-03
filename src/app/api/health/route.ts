import { NextResponse } from "next/server";
import { getSql, hasDatabaseUrl } from "@/server/db/client";

async function checkDatabase() {
  if (!hasDatabaseUrl()) return { ok: false, error: "DATABASE_URL is not configured" };

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      getSql()`select 1`,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Database health check timed out")), 3000);
      }),
    ]);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Database health check failed",
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function GET() {
  const database = await checkDatabase();

  return NextResponse.json({
    ok: true,
    service: "portfolio-next-backend",
    database,
  });
}
