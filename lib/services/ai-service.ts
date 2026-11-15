import type { CanvasNode, CanvasEdge, ProjectType } from "@/types";
import { generateId } from "@/lib/utils";

interface GeneratedGraph {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const PAGE_TEMPLATES: Record<string, { label: string; path: string; desc: string }[]> = {
  "web-app": [
    { label: "Home", path: "/", desc: "Main landing page" },
    { label: "Login", path: "/login", desc: "User authentication" },
    { label: "Registration", path: "/register", desc: "New account creation" },
    { label: "Dashboard", path: "/dashboard", desc: "User's main workspace" },
    { label: "Profile", path: "/profile", desc: "User profile and settings" },
    { label: "Settings", path: "/settings", desc: "Application preferences" },
  ],
  website: [
    { label: "Home", path: "/", desc: "Main landing page" },
    { label: "About", path: "/about", desc: "Company information" },
    { label: "Services", path: "/services", desc: "Service offerings" },
    { label: "Contact", path: "/contact", desc: "Contact form and info" },
    { label: "Blog", path: "/blog", desc: "Articles and updates" },
  ],
  ecommerce: [
    { label: "Home", path: "/", desc: "Store homepage" },
    { label: "Products", path: "/products", desc: "Product catalog" },
    { label: "Product Detail", path: "/products/:id", desc: "Individual product page" },
    { label: "Cart", path: "/cart", desc: "Shopping cart" },
    { label: "Checkout", path: "/checkout", desc: "Payment and order completion" },
    { label: "Account", path: "/account", desc: "Customer account" },
  ],
  saas: [
    { label: "Landing", path: "/", desc: "Marketing landing page" },
    { label: "Login", path: "/login", desc: "User authentication" },
    { label: "Dashboard", path: "/dashboard", desc: "Main application view" },
    { label: "Settings", path: "/settings", desc: "Account and app settings" },
    { label: "Billing", path: "/billing", desc: "Subscription management" },
    { label: "Team", path: "/team", desc: "Team member management" },
  ],
};

const FEATURE_TEMPLATES: Record<string, { label: string; desc: string; priority: "high" | "critical" | "medium" }[]> = {
  "web-app": [
    { label: "Authentication", desc: "User login, registration, and session management", priority: "critical" },
    { label: "User Management", desc: "Profile creation and account settings", priority: "high" },
    { label: "Notifications", desc: "In-app and email notification system", priority: "medium" },
    { label: "Search", desc: "Full-text search across content", priority: "medium" },
  ],
  ecommerce: [
    { label: "Authentication", desc: "Customer login and registration", priority: "critical" },
    { label: "Product Catalog", desc: "Product listing and filtering", priority: "critical" },
    { label: "Shopping Cart", desc: "Add, remove, and manage cart items", priority: "critical" },
    { label: "Payment Processing", desc: "Secure checkout with Stripe", priority: "critical" },
    { label: "Order Management", desc: "Order tracking and history", priority: "high" },
  ],
  saas: [
    { label: "Authentication", desc: "Login, registration, and SSO", priority: "critical" },
    { label: "Subscription Billing", desc: "Plan management and payment processing", priority: "critical" },
    { label: "Team Management", desc: "Invite and manage team members", priority: "high" },
    { label: "Analytics", desc: "Usage metrics and reporting", priority: "medium" },
    { label: "API Access", desc: "REST API for integrations", priority: "medium" },
  ],
};

function extractKeywords(idea: string): string[] {
  const keywords = idea.toLowerCase().split(/\s+/);
  const relevant = ["learn", "course", "video", "payment", "user", "admin", "search", "message", "notification", "upload", "review", "track", "manage", "book", "order", "product", "team", "report"];
  return relevant.filter((k) => keywords.some((w) => w.includes(k)));
}

export function generateProjectStructure(idea: string, type: ProjectType): GeneratedGraph {
  const pages = PAGE_TEMPLATES[type] || PAGE_TEMPLATES["web-app"];
  const features = FEATURE_TEMPLATES[type] || FEATURE_TEMPLATES["web-app"];
  const keywords = extractKeywords(idea);

  // Add keyword-based features
  const extraFeatures: typeof features = [];
  if (keywords.includes("learn") || keywords.includes("course")) {
    extraFeatures.push({ label: "Course Management", desc: "Create and organize course content", priority: "critical" });
    extraFeatures.push({ label: "Progress Tracking", desc: "Track lesson completion and scores", priority: "high" });
  }
  if (keywords.includes("video")) {
    extraFeatures.push({ label: "Video Streaming", desc: "Adaptive video playback", priority: "high" });
  }
  if (keywords.includes("message")) {
    extraFeatures.push({ label: "Messaging", desc: "Real-time chat between users", priority: "medium" });
  }
  if (keywords.includes("review")) {
    extraFeatures.push({ label: "Reviews & Ratings", desc: "User-generated reviews", priority: "medium" });
  }

  const allFeatures = [...features, ...extraFeatures].slice(0, 6);

  const nodes: CanvasNode[] = [];
  const edges: CanvasEdge[] = [];

  // User roles
  const roles = ["User", "Administrator"];
  if (keywords.includes("learn") || keywords.includes("course")) roles.splice(0, 1, "Student", "Instructor");
  roles.forEach((role, i) => {
    nodes.push({
      id: `role-${generateId()}`,
      type: "user-role",
      position: { x: 80 + i * 200, y: 60 },
      data: { label: role, description: `${role} persona`, icon: "User" },
    });
  });

  // Pages
  pages.forEach((page, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    nodes.push({
      id: `page-${generateId()}`,
      type: "page",
      position: { x: 80 + col * 220, y: 220 + row * 160 },
      data: { label: page.label, description: page.desc, path: page.path },
    });
  });

  // Features
  allFeatures.forEach((feat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    nodes.push({
      id: `feat-${generateId()}`,
      type: "feature",
      position: { x: 800 + col * 220, y: 220 + row * 160 },
      data: { label: feat.label, description: feat.desc, priority: feat.priority },
    });
  });

  // Workflow
  nodes.push({
    id: `wf-${generateId()}`,
    type: "workflow",
    position: { x: 1260, y: 400 },
    data: {
      label: "Main User Flow",
      trigger: "User opens the application",
      steps: ["User visits the homepage", "Creates an account or logs in", "Explores main features", "Completes primary action", "Receives confirmation"],
      outcome: "User successfully completes their goal",
    },
  });

  // Edges: connect pages sequentially
  const pageNodes = nodes.filter((n) => n.type === "page");
  const featNodes = nodes.filter((n) => n.type === "feature");
  const roleNodes = nodes.filter((n) => n.type === "user-role");

  // Role → first page
  if (roleNodes.length && pageNodes.length) {
    edges.push({ id: `e-${generateId()}`, source: roleNodes[0].id, target: pageNodes[0].id });
  }

  // Page chain
  for (let i = 0; i < Math.min(pageNodes.length - 1, 4); i++) {
    edges.push({ id: `e-${generateId()}`, source: pageNodes[i].id, target: pageNodes[i + 1].id });
  }

  // Pages → features
  if (pageNodes.length > 1 && featNodes.length) {
    edges.push({ id: `e-${generateId()}`, source: pageNodes[1].id, target: featNodes[0].id });
  }
  if (pageNodes.length > 2 && featNodes.length > 1) {
    edges.push({ id: `e-${generateId()}`, source: pageNodes[2].id, target: featNodes[1].id });
  }

  // Feature chain
  for (let i = 0; i < Math.min(featNodes.length - 1, 3); i++) {
    edges.push({ id: `e-${generateId()}`, source: featNodes[i].id, target: featNodes[i + 1].id });
  }

  return { nodes, edges };
}
