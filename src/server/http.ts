import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAdminAuthenticated } from "./auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function problem(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return problem("Validation failed", 422, error.flatten());
  }

  if (error instanceof Error && error.message.includes("timed out")) {
    console.error(error);
    return problem(
      `${error.message}. The server could not reach the database. Check Supabase pooler connection, network, or VPN/firewall.`,
      504,
    );
  }

  console.error(error);
  return problem("Something went wrong", 500);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return problem("Unauthorized", 401);
  }
  return undefined;
}
