import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { cache } from "react";
import { getDb, hasDatabaseUrl, resetDatabaseConnection } from "@/server/db/client";
import { experiences, messages, profile, projects, social } from "@/server/db/schema";
import { defaultPortfolioData } from "./seed";
import type { Experience, Message, PortfolioData, Profile, Project, Social } from "./types";

type ProjectInput = Omit<Project, "id" | "liveUrl" | "githubUrl" | "features"> & {
  id?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  features?: string[] | null;
};
type ExperienceInput = Omit<Experience, "id" | "endDate"> & {
  id?: string;
  endDate?: string | null;
};

const legacyDemoProjectIds = new Set([
  "ledgerly-saas-accounting",
  "nimbus-team-chat",
  "orbit-crm",
  "pulse-uptime-monitor",
]);

const legacyDemoExperienceIds = new Set(["freelance-full-stack", "tech-studio-software-engineer"]);

function isLegacyDemoProfile(row: Profile) {
  return (
    row.name === "Levan" &&
    row.title === "Software Engineer - Full-Stack Developer" &&
    row.intro.startsWith("I design and build fast, reliable web products") &&
    row.about.startsWith("I'm a full-stack software engineer focused on shipping")
  );
}

function isLegacyDemoSocial(row: Social) {
  return (
    row.linkedin === "https://linkedin.com/in/your-handle" &&
    row.github === "https://github.com/your-handle" &&
    row.email === "hello@example.com" &&
    row.website === ""
  );
}

function makeId(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || randomUUID();
}

function normalizeProject(project: ProjectInput): Project {
  return {
    ...project,
    id: project.id || makeId(project.name),
    liveUrl: project.liveUrl || undefined,
    githubUrl: project.githubUrl || undefined,
    features: project.features ?? [],
  };
}

function normalizeExperience(experience: ExperienceInput): Experience {
  return {
    ...experience,
    id: experience.id || makeId(`${experience.company}-${experience.position}`),
    endDate: experience.current ? undefined : experience.endDate || undefined,
  };
}

function mapMessage(row: typeof messages.$inferSelect): Message {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
  };
}

let databaseUnavailableUntil = 0;
let portfolioSnapshot: PortfolioData = defaultPortfolioData;

function timeoutMs(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

type DatabaseReadOptions = {
  bypassCooldown?: boolean;
  timeout?: number;
};

function withTimeout<T>(operation: Promise<T>, label: string, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  return Promise.race([operation, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function withDatabase<T>(
  operation: () => Promise<T>,
  fallback: T,
  options: DatabaseReadOptions = {},
) {
  if (!hasDatabaseUrl()) return fallback;
  if (!options.bypassCooldown && Date.now() < databaseUnavailableUntil) return fallback;

  try {
    return await withTimeout(
      operation(),
      "Database read",
      options.timeout ?? timeoutMs("DB_READ_TIMEOUT_MS", 900),
    );
  } catch (error) {
    if (!options.bypassCooldown) {
      databaseUnavailableUntil = Date.now() + timeoutMs("DB_READ_RETRY_AFTER_MS", 10000);
    }
    if (error instanceof Error && error.message.includes("timed out")) {
      await resetDatabaseConnection();
    }
    console.warn("Database unavailable, returning empty portfolio data for read.", error);
    return fallback;
  }
}

async function runDatabaseWrite<T>(operation: Promise<T>) {
  try {
    const result = await withTimeout(
      operation,
      "Database write",
      timeoutMs("DB_WRITE_TIMEOUT_MS", 12000),
    );
    databaseUnavailableUntil = 0;
    return result;
  } catch (error) {
    if (error instanceof Error && error.message.includes("timed out")) {
      await resetDatabaseConnection();
    }
    throw error;
  }
}

async function loadPortfolioData(includeMessages = false): Promise<PortfolioData> {
  return withDatabase(
    async () => {
      const db = getDb();
      const [profileRows, socialRows, projectRows, experienceRows, messageRows] = await Promise.all(
        [
          db.select().from(profile).limit(1),
          db.select().from(social).limit(1),
          db.select().from(projects).orderBy(asc(projects.order)),
          db.select().from(experiences).orderBy(desc(experiences.startDate)),
          includeMessages
            ? db.select().from(messages).orderBy(desc(messages.createdAt))
            : Promise.resolve([]),
        ],
      );

      const data: PortfolioData = {
        profile:
          profileRows[0] && !isLegacyDemoProfile(profileRows[0])
            ? profileRows[0]
            : defaultPortfolioData.profile,
        social:
          socialRows[0] && !isLegacyDemoSocial(socialRows[0])
            ? socialRows[0]
            : defaultPortfolioData.social,
        projects: projectRows
          .filter((project) => !legacyDemoProjectIds.has(project.id))
          .map(normalizeProject),
        experiences: experienceRows
          .filter((experience) => !legacyDemoExperienceIds.has(experience.id))
          .map(normalizeExperience),
        messages: includeMessages ? messageRows.map(mapMessage) : portfolioSnapshot.messages,
      };
      portfolioSnapshot = data;
      return {
        ...data,
        messages: includeMessages ? data.messages : [],
      };
    },
    {
      ...portfolioSnapshot,
      messages: includeMessages ? portfolioSnapshot.messages : [],
    },
    {
      bypassCooldown: includeMessages,
      timeout: includeMessages ? timeoutMs("DB_ADMIN_READ_TIMEOUT_MS", 8000) : undefined,
    },
  );
}

const getCachedPublicPortfolioData = cache(() => loadPortfolioData(false));

export async function getPortfolioData(includeMessages = false): Promise<PortfolioData> {
  if (includeMessages) return loadPortfolioData(true);
  return getCachedPublicPortfolioData();
}

export async function saveProfile(value: Profile) {
  const db = getDb();
  const [row] = await runDatabaseWrite(
    db
      .insert(profile)
      .values({ id: "default", ...value })
      .onConflictDoUpdate({
        target: profile.id,
        set: { ...value, updatedAt: new Date() },
      })
      .returning(),
  );
  portfolioSnapshot = { ...portfolioSnapshot, profile: row };
  return row;
}

export async function saveSocial(value: Social) {
  const db = getDb();
  const [row] = await runDatabaseWrite(
    db
      .insert(social)
      .values({ id: "default", ...value })
      .onConflictDoUpdate({
        target: social.id,
        set: { ...value, updatedAt: new Date() },
      })
      .returning(),
  );
  portfolioSnapshot = { ...portfolioSnapshot, social: row };
  return row;
}

export async function upsertProject(value: ProjectInput) {
  const db = getDb();
  const next = normalizeProject(value);
  const [row] = await runDatabaseWrite(
    db
      .insert(projects)
      .values(next)
      .onConflictDoUpdate({
        target: projects.id,
        set: { ...next, updatedAt: new Date() },
      })
      .returning(),
  );
  const saved = normalizeProject(row);
  const exists = portfolioSnapshot.projects.some((project) => project.id === saved.id);
  portfolioSnapshot = {
    ...portfolioSnapshot,
    projects: exists
      ? portfolioSnapshot.projects.map((project) => (project.id === saved.id ? saved : project))
      : [...portfolioSnapshot.projects, saved],
  };
  return saved;
}

export async function deleteProject(id: string) {
  await runDatabaseWrite(getDb().delete(projects).where(eq(projects.id, id)));
  portfolioSnapshot = {
    ...portfolioSnapshot,
    projects: portfolioSnapshot.projects.filter((project) => project.id !== id),
  };
}

export async function upsertExperience(value: ExperienceInput) {
  const db = getDb();
  const next = normalizeExperience(value);
  const [row] = await runDatabaseWrite(
    db
      .insert(experiences)
      .values(next)
      .onConflictDoUpdate({
        target: experiences.id,
        set: { ...next, updatedAt: new Date() },
      })
      .returning(),
  );
  const saved = normalizeExperience(row);
  const exists = portfolioSnapshot.experiences.some((experience) => experience.id === saved.id);
  portfolioSnapshot = {
    ...portfolioSnapshot,
    experiences: exists
      ? portfolioSnapshot.experiences.map((experience) =>
          experience.id === saved.id ? saved : experience,
        )
      : [...portfolioSnapshot.experiences, saved],
  };
  return saved;
}

export async function deleteExperience(id: string) {
  await runDatabaseWrite(getDb().delete(experiences).where(eq(experiences.id, id)));
  portfolioSnapshot = {
    ...portfolioSnapshot,
    experiences: portfolioSnapshot.experiences.filter((experience) => experience.id !== id),
  };
}

export async function createMessage(value: Omit<Message, "id" | "createdAt" | "read">) {
  const [row] = await runDatabaseWrite(
    getDb()
      .insert(messages)
      .values({
        ...value,
        id: randomUUID(),
        read: false,
      })
      .returning(),
  );
  const saved = mapMessage(row);
  portfolioSnapshot = {
    ...portfolioSnapshot,
    messages: [saved, ...portfolioSnapshot.messages],
  };
  return saved;
}

export async function updateMessageRead(id: string, read: boolean) {
  const [row] = await runDatabaseWrite(
    getDb().update(messages).set({ read }).where(eq(messages.id, id)).returning(),
  );
  const saved = row ? mapMessage(row) : undefined;
  if (saved) {
    portfolioSnapshot = {
      ...portfolioSnapshot,
      messages: portfolioSnapshot.messages.map((message) => (message.id === id ? saved : message)),
    };
  }
  return saved;
}

export async function deleteMessage(id: string) {
  await runDatabaseWrite(getDb().delete(messages).where(eq(messages.id, id)));
  portfolioSnapshot = {
    ...portfolioSnapshot,
    messages: portfolioSnapshot.messages.filter((message) => message.id !== id),
  };
}
