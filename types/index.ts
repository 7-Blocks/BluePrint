export type ProjectStatus = "draft" | "in-review" | "approved";
export type ProjectType =
  | "website"
  | "web-app"
  | "mobile-app"
  | "ecommerce"
  | "saas"
  | "other";
export type NodeType = "page" | "feature" | "user-role" | "integration" | "workflow";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  shareId?: string;
  thumbnail?: string;
  audience?: string;
  objective?: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  comments: Comment[];
  versions: ProjectVersion[];
}

export interface CanvasNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  path?: string;
  priority?: Priority;
  features?: string[];
  userAccess?: string[];
  dependencies?: string[];
  notes?: string;
  trigger?: string;
  steps?: string[];
  outcome?: string;
  icon?: string;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Comment {
  id: string;
  nodeId?: string;
  author: string;
  authorRole: "client" | "developer";
  content: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

export interface CommentReply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ProjectVersion {
  id: string;
  version: string;
  createdAt: string;
  author: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "freelancer" | "agency" | "developer" | "other";
  organization?: string;
  avatar?: string;
}

export interface GeneratedStructure {
  objective: string;
  targetAudience: string;
  mainProblem: string;
  userRoles: string[];
  pages: GeneratedPage[];
  features: GeneratedFeature[];
  workflows: GeneratedWorkflow[];
}

export interface GeneratedPage {
  id: string;
  name: string;
  description: string;
  path: string;
  features: string[];
  accepted: boolean;
}

export interface GeneratedFeature {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  accepted: boolean;
}

export interface GeneratedWorkflow {
  id: string;
  name: string;
  steps: string[];
  accepted: boolean;
}
