import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return undefined;
}

const databaseUrl = getDatabaseUrl();

const globalForDb = globalThis as unknown as {
  portfolioSql?: postgres.Sql;
  portfolioDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export function hasDatabaseUrl() {
  return Boolean(databaseUrl);
}

export function getDb() {
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Use the Supabase Postgres pooler URI.");
  }

  if (!globalForDb.portfolioSql) {
    globalForDb.portfolioSql = postgres(databaseUrl, {
      max: 3,
      prepare: false,
      connect_timeout: 5,
      idle_timeout: 20,
    });
  }

  if (!globalForDb.portfolioDb) {
    globalForDb.portfolioDb = drizzle(globalForDb.portfolioSql, { schema });
  }

  return globalForDb.portfolioDb;
}

export function getSql() {
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Use the Supabase Postgres pooler URI.");
  }

  if (!globalForDb.portfolioSql) {
    globalForDb.portfolioSql = postgres(databaseUrl, {
      max: 3,
      prepare: false,
      connect_timeout: 5,
      idle_timeout: 20,
    });
  }

  return globalForDb.portfolioSql;
}

export async function resetDatabaseConnection() {
  const sql = globalForDb.portfolioSql;
  globalForDb.portfolioSql = undefined;
  globalForDb.portfolioDb = undefined;

  if (sql) {
    await sql.end({ timeout: 1 }).catch(() => undefined);
  }
}
