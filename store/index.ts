"use client";
import { create } from "zustand";
import type { Project, CanvasNode, CanvasEdge, Comment, User } from "@/types";
import { getProjects, saveProject, deleteProject, getAuthUser, setAuth, clearAuth } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { MOCK_USER } from "@/lib/mock-data/projects";

interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  initAuth: () => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  projects: Project[];
  loadProjects: () => void;
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  setSaveStatus: (s: "saved" | "saving" | "unsaved" | "error") => void;
  undoStack: { nodes: CanvasNode[]; edges: CanvasEdge[] }[];
  redoStack: { nodes: CanvasNode[]; edges: CanvasEdge[] }[];
  pushUndo: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  undo: (projectId: string) => void;
  redo: (projectId: string) => void;
  addComment: (projectId: string, comment: Omit<Comment, "id" | "createdAt" | "replies">) => void;
  resolveComment: (projectId: string, commentId: string) => void;
  addReply: (projectId: string, commentId: string, content: string) => void;
}

export const useAppStore = create<StoreState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  initAuth() {
    const stored = getAuthUser();
    if (stored) {
      set({ user: { ...MOCK_USER, ...stored }, isAuthenticated: true });
    }
  },

  login(email, name) {
    setAuth({ email, name });
    set({ user: { ...MOCK_USER, email, name }, isAuthenticated: true });
  },

  logout() {
    clearAuth();
    set({ user: null, isAuthenticated: false });
  },

  projects: [],

  loadProjects() {
    set({ projects: getProjects() });
  },

  createProject(data) {
    const project: Project = {
      id: `proj-${generateId()}`,
      name: data.name || "Untitled Project",
      description: data.description || "",
      type: data.type || "website",
      status: "draft",
      version: "v1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: "user-1",
      shareId: `share-${generateId()}`,
      nodes: data.nodes || [],
      edges: data.edges || [],
      comments: [],
      versions: [],
      audience: data.audience,
      objective: data.objective,
    };
    saveProject(project);
    set((s) => ({ projects: [project, ...s.projects] }));
    return project;
  },

  updateProject(id, data) {
    const current = get().projects.find((p) => p.id === id);
    if (!current) return;
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    saveProject(updated);
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? updated : p)) }));
  },

  removeProject(id) {
    deleteProject(id);
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },

  selectedNodeId: null,
  setSelectedNode(id) { set({ selectedNodeId: id }); },

  saveStatus: "saved",
  setSaveStatus(s) { set({ saveStatus: s }); },

  undoStack: [],
  redoStack: [],

  pushUndo(nodes, edges) {
    set((s) => ({ undoStack: [...s.undoStack.slice(-19), { nodes, edges }], redoStack: [] }));
  },

  undo(projectId) {
    const { undoStack, projects } = get();
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    const current = projects.find((p) => p.id === projectId);
    if (!current) return;
    set((s) => ({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, { nodes: current.nodes, edges: current.edges }],
    }));
    get().updateProject(projectId, { nodes: prev.nodes, edges: prev.edges });
  },

  redo(projectId) {
    const { redoStack, projects } = get();
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    const current = projects.find((p) => p.id === projectId);
    if (!current) return;
    set((s) => ({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, { nodes: current.nodes, edges: current.edges }],
    }));
    get().updateProject(projectId, { nodes: next.nodes, edges: next.edges });
  },

  addComment(projectId, comment) {
    const newComment: Comment = {
      ...comment,
      id: `comment-${generateId()}`,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;
    get().updateProject(projectId, { comments: [...project.comments, newComment] });
  },

  resolveComment(projectId, commentId) {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;
    get().updateProject(projectId, {
      comments: project.comments.map((c) => (c.id === commentId ? { ...c, resolved: true } : c)),
    });
  },

  addReply(projectId, commentId, content) {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;
    get().updateProject(projectId, {
      comments: project.comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, { id: generateId(), author: "Alex Rivera", content, createdAt: new Date().toISOString() }] }
          : c
      ),
    });
  },
}));
