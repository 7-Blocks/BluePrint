import type { Project } from "@/types";
import { SAMPLE_PROJECTS } from "@/lib/mock-data/projects";

const STORAGE_KEY = "Blueprint_projects";
const AUTH_KEY = "Blueprint_auth";

export function getProjects(): Project[] {
  if (typeof window === "undefined") return SAMPLE_PROJECTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    return JSON.parse(stored);
  } catch {
    return SAMPLE_PROJECTS;
  }
}

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return;
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.unshift(project);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): void {
  if (typeof window === "undefined") return;
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function getProjectByShareId(shareId: string): Project | undefined {
  return getProjects().find((p) => p.shareId === shareId);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(AUTH_KEY);
}

export function setAuth(user: { name: string; email: string }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthUser(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
