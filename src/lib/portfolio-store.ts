"use client";

import { create } from "zustand";
import { defaultPortfolioData } from "@/server/portfolio/seed";
import type {
  Experience,
  Message,
  PortfolioData,
  Profile,
  Project,
  Social,
} from "@/server/portfolio/types";
import { experienceDuration, formatMonth } from "./portfolio-utils";

export type { Experience, Message, Profile, Project, Social };
export { experienceDuration, formatMonth };

type State = PortfolioData & {
  auth: boolean;
  loading: boolean;
  error: string;

  checkSession: () => Promise<void>;
  loadAdminData: () => Promise<void>;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => Promise<void>;
  uploadImage: (file: File, folder: string) => Promise<string>;

  saveProfile: (p: Partial<Profile>) => Promise<void>;
  saveSocial: (s: Partial<Social>) => Promise<void>;

  upsertProject: (p: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  upsertExperience: (e: Experience) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  addMessage: (m: Omit<Message, "id" | "createdAt" | "read">) => Promise<void>;
  toggleRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  const isFormData = init?.body instanceof FormData;

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => undefined)) as
        | { error?: string; details?: unknown }
        | undefined;
      throw new Error(payload?.error ?? `Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Check the database connection and try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const usePortfolio = create<State>()((set, get) => ({
  ...defaultPortfolioData,
  auth: false,
  loading: true,
  error: "",

  checkSession: async () => {
    try {
      const session = await api<{ authenticated: boolean }>("/api/auth/session");
      set({ auth: session.authenticated, loading: false, error: "" });
      if (session.authenticated) await get().loadAdminData();
    } catch (error) {
      console.error(error);
      set({ auth: false, loading: false, error: "Could not check admin session." });
    }
  },

  loadAdminData: async () => {
    try {
      set({ loading: true, error: "" });
      const data = await api<PortfolioData>("/api/portfolio?includeMessages=true");
      set({ ...data, loading: false, error: "" });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Could not load portfolio data.",
      });
    }
  },

  login: async (username, password) => {
    try {
      await api<{ authenticated: boolean }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      set({ auth: true });
      await get().loadAdminData();
      return true;
    } catch {
      set({ auth: false, loading: false, error: "" });
      return false;
    }
  },

  logout: async () => {
    await api("/api/auth/logout", { method: "POST" });
    set({ auth: false, messages: [], error: "" });
  },

  uploadImage: async (file, folder) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    const uploaded = await api<{ url: string }>("/api/uploads", {
      method: "POST",
      body: formData,
    });

    return uploaded.url;
  },

  saveProfile: async (value) => {
    const profile = await api<Profile>("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ ...get().profile, ...value }),
    });
    set({ profile, error: "" });
  },

  saveSocial: async (value) => {
    const social = await api<Social>("/api/social", {
      method: "PUT",
      body: JSON.stringify({ ...get().social, ...value }),
    });
    set({ social, error: "" });
  },

  upsertProject: async (project) => {
    const saved = await api<Project>(project.id ? `/api/projects/${project.id}` : "/api/projects", {
      method: project.id ? "PUT" : "POST",
      body: JSON.stringify(project),
    });
    set((state) => {
      const exists = state.projects.some((x) => x.id === saved.id);
      return {
        projects: exists
          ? state.projects.map((x) => (x.id === saved.id ? saved : x))
          : [...state.projects, saved],
        error: "",
      };
    });
  },

  deleteProject: async (id) => {
    await api(`/api/projects/${id}`, { method: "DELETE" });
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      error: "",
    }));
  },

  upsertExperience: async (experience) => {
    const saved = await api<Experience>(
      experience.id ? `/api/experiences/${experience.id}` : "/api/experiences",
      {
        method: experience.id ? "PUT" : "POST",
        body: JSON.stringify(experience),
      },
    );
    set((state) => {
      const exists = state.experiences.some((x) => x.id === saved.id);
      return {
        experiences: exists
          ? state.experiences.map((x) => (x.id === saved.id ? saved : x))
          : [...state.experiences, saved],
        error: "",
      };
    });
  },

  deleteExperience: async (id) => {
    await api(`/api/experiences/${id}`, { method: "DELETE" });
    set((state) => ({
      experiences: state.experiences.filter((experience) => experience.id !== id),
      error: "",
    }));
  },

  addMessage: async (message) => {
    const saved = await api<Message>("/api/messages", {
      method: "POST",
      body: JSON.stringify(message),
    });
    set((state) => ({ messages: [saved, ...state.messages], error: "" }));
  },

  toggleRead: async (id) => {
    const message = get().messages.find((item) => item.id === id);
    if (!message) return;
    const saved = await api<Message>(`/api/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: !message.read }),
    });
    set((state) => ({
      messages: state.messages.map((item) => (item.id === id ? saved : item)),
      error: "",
    }));
  },

  deleteMessage: async (id) => {
    await api(`/api/messages/${id}`, { method: "DELETE" });
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
      error: "",
    }));
  },
}));

export const newProject = (): Project => ({
  id: "",
  name: "",
  description: "",
  longDescription: "",
  image: "",
  liveUrl: "",
  githubUrl: "",
  tech: [],
  featured: false,
  order: 99,
});

export const newExperience = (): Experience => ({
  id: "",
  company: "",
  position: "",
  startDate: new Date().toISOString().slice(0, 7),
  current: true,
  description: "",
  tech: [],
});
