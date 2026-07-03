import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "");

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(180),
  intro: z.string().trim().min(1).max(600),
  about: z.string().trim().min(1).max(4000),
  cvUrl: optionalUrl,
  avatar: optionalUrl,
});

export const socialSchema = z.object({
  linkedin: optionalUrl,
  github: optionalUrl,
  email: z.string().trim().email().max(160).or(z.literal("")),
  website: optionalUrl,
});

export const projectSchema = z.object({
  id: z.string().trim().max(120).optional(),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(500),
  longDescription: z.string().trim().max(5000).default(""),
  image: optionalUrl.default(""),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  tech: z.array(z.string().trim().min(1).max(60)).max(40).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(10000).default(99),
  features: z.array(z.string().trim().min(1).max(180)).max(30).optional(),
});

export const experienceSchema = z.object({
  id: z.string().trim().max(120).optional(),
  company: z.string().trim().min(1).max(160),
  position: z.string().trim().min(1).max(180),
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  current: z.boolean().default(false),
  description: z.string().trim().min(1).max(4000),
  tech: z.array(z.string().trim().min(1).max(60)).max(40).default([]),
});

export const messageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.string().trim().min(1, "Subject is required").max(120),
  message: z.string().trim().min(10, "Say a little more (min 10 chars)").max(2000),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(300),
});
