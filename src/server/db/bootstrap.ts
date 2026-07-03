import "server-only";

import { getSql, hasDatabaseUrl } from "./client";

let setupPromise: Promise<void> | undefined;

export function ensureDatabaseReady() {
  if (!hasDatabaseUrl()) return Promise.resolve();
  setupPromise ??= setupDatabase();
  return setupPromise;
}

async function setupDatabase() {
  const sql = getSql();

  await sql`
    create table if not exists portfolio_profile (
      id text primary key default 'default',
      name text not null,
      title text not null,
      intro text not null,
      about text not null,
      cv_url text not null default '',
      avatar text not null default '',
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists portfolio_social (
      id text primary key default 'default',
      linkedin text not null default '',
      github text not null default '',
      email text not null default '',
      website text not null default '',
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    alter table portfolio_social
    drop column if exists telegram
  `;

  await sql`
    create table if not exists portfolio_projects (
      id text primary key,
      name text not null,
      description text not null,
      long_description text not null default '',
      image text not null default '',
      live_url text,
      github_url text,
      tech jsonb not null default '[]'::jsonb,
      featured boolean not null default false,
      display_order integer not null default 99,
      features jsonb,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists portfolio_experiences (
      id text primary key,
      company text not null,
      position text not null,
      start_date text not null,
      end_date text,
      current boolean not null default false,
      description text not null,
      tech jsonb not null default '[]'::jsonb,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists portfolio_messages (
      id text primary key,
      name text not null,
      email text not null,
      subject text not null,
      message text not null,
      created_at timestamptz not null default now(),
      read boolean not null default false
    )
  `;
}
