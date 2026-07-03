export type Project = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  tech: string[];
  featured: boolean;
  order: number;
  features?: string[];
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  tech: string[];
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Social = {
  linkedin: string;
  github: string;
  email: string;
  website: string;
};

export type Profile = {
  name: string;
  title: string;
  intro: string;
  about: string;
  cvUrl: string;
  avatar: string;
};

export type PortfolioData = {
  profile: Profile;
  social: Social;
  projects: Project[];
  experiences: Experience[];
  messages: Message[];
};
