import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const profile = pgTable("portfolio_profile", {
  id: text("id").primaryKey().default("default"),
  name: text("name").notNull(),
  title: text("title").notNull(),
  intro: text("intro").notNull(),
  about: text("about").notNull(),
  cvUrl: text("cv_url").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const social = pgTable("portfolio_social", {
  id: text("id").primaryKey().default("default"),
  linkedin: text("linkedin").notNull().default(""),
  github: text("github").notNull().default(""),
  email: text("email").notNull().default(""),
  website: text("website").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("portfolio_projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull().default(""),
  image: text("image").notNull().default(""),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  tech: jsonb("tech").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  order: integer("display_order").notNull().default(99),
  features: jsonb("features").$type<string[]>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const experiences = pgTable("portfolio_experiences", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  current: boolean("current").notNull().default(false),
  description: text("description").notNull(),
  tech: jsonb("tech").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("portfolio_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
});
