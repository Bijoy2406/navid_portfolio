import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

function loadYaml<T>(filename: string): T {
  const filepath = path.join(process.cwd(), "content", filename);
  const raw = fs.readFileSync(filepath, "utf8");
  return yaml.load(raw) as T;
}

export interface Hero {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  cv_url: string;
  background_image: string;
}

export interface Summary {
  paragraphs: string[];
  blockquote: string;
}

export interface Project {
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Job {
  title: string;
  company: string;
  period: string;
  description: string;
  bullets: string[];
  projects: Project[];
}

export interface Experience {
  jobs: Job[];
}

export interface Tool {
  name: string;
  image: string;
}

export interface Skills {
  skills: string[];
  tools: Tool[];
}

export interface Language {
  name: string;
  level: number;
}

export interface Languages {
  languages: Language[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
}

export interface Certificate {
  name: string;
  date: string;
}

export interface Education {
  education: EducationEntry[];
  certificates: Certificate[];
}

export interface Socials {
  linkedin: string;
  dribbble: string;
  twitter: string;
  instagram: string;
  behance: string;
}

export interface Links {
  email: string;
  phone: string;
  socials: Socials;
}

export interface SiteContent {
  hero: Hero;
  summary: Summary;
  experience: Experience;
  skills: Skills;
  languages: Languages;
  education: Education;
  links: Links;
}

export function loadContent(): SiteContent {
  return {
    hero: loadYaml<Hero>("hero.yaml"),
    summary: loadYaml<Summary>("summary.yaml"),
    experience: loadYaml<Experience>("experience.yaml"),
    skills: loadYaml<Skills>("skills.yaml"),
    languages: loadYaml<Languages>("languages.yaml"),
    education: loadYaml<Education>("education.yaml"),
    links: loadYaml<Links>("links.yaml"),
  };
}
