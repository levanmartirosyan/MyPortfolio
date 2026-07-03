import type { Experience, PortfolioData, Profile, Project, Social } from "./types";

export const defaultProfile: Profile = {
  name: "",
  title: "",
  intro: "",
  about: "",
  cvUrl: "",
  avatar: "",
};

export const defaultSocial: Social = {
  linkedin: "",
  github: "",
  email: "",
  website: "",
};

export const defaultProjects: Project[] = [];

export const defaultExperiences: Experience[] = [];

export const defaultPortfolioData: PortfolioData = {
  profile: defaultProfile,
  social: defaultSocial,
  projects: defaultProjects,
  experiences: defaultExperiences,
  messages: [],
};
