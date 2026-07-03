import "server-only";

import { cookies } from "next/headers";
import { timingSafeEqual, createHmac, randomBytes } from "node:crypto";

const cookieName = "portfolio_admin_session";
const maxAgeSeconds = 60 * 60 * 24 * 7;

function authSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.SUPABASE_DB_PASSWORD ||
    process.env.NEXT_PUBLIC_SUPABASE_PASSWORD ||
    "dev-secret-change-me"
  );
}

function sign(value: string) {
  return createHmac("sha256", authSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "admin";
  return safeEqual(password, expected);
}

export function verifyLogin(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  return safeEqual(username, expectedUser) && verifyPassword(password);
}

export async function createAdminSession() {
  const token = randomBytes(32).toString("base64url");
  const value = `${token}.${sign(token)}`;
  const cookieStore = await cookies();
  cookieStore.set(cookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(cookieName)?.value;
  if (!value) return false;

  const [token, signature] = value.split(".");
  if (!token || !signature) return false;
  return safeEqual(signature, sign(token));
}
