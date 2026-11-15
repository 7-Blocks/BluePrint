"use client";
import { useState } from "react";
import { FileText, Zap, Users, Plug, GitBranch, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import type { NodeType } from "@/types";

const PANEL_SECTIONS: {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  items: { label: string; desc: string; icon?: string }[];
}[] = [
  {
    id: "pages", label: "Pages", icon: FileText, color: "#a78bfa",
    items: [
      { label: "Home", desc: "Main landing page" },
      { label: "About", desc: "Company or product info" },
      { label: "Login", desc: "User authentication" },
      { label: "Registration", desc: "New account creation" },
      { label: "Dashboard", desc: "User workspace" },
      { label: "Profile", desc: "User profile page" },
      { label: "Settings", desc: "App preferences" },
      { label: "Pricing", desc: "Pricing plans" },
      { label: "Checkout", desc: "Payment flow" },
      { label: "Contact", desc: "Contact form" },
    ],
  },
  {
    id: "features", label: "Features", icon: Zap, color: "#60a5fa",
    items: [
      { label: "Authentication", desc: "Login and registration" },
      { label: "User Management", desc: "Account management" },
      { label: "Search", desc: "Content search" },
      { label: "Notifications", desc: "Alerts and messages" },
      { label: "Payment Processing", desc: "Stripe or PayPal" },
      { label: "File Uploads", desc: "Media management" },
      { label: "Messaging", desc: "Real-time chat" },
      { label: "Reviews", desc: "Ratings and feedback" },
    ],
  },
  {
    id: "user-roles", label: "User Roles", icon: Users, color: "#4ade80",
    items: [
      { label: "Guest", desc: "Unauthenticated visitor" },
      { label: "User", desc: "Standard account holder" },
      { label: "Admin", desc: "Platform administrator" },
      { label: "Moderator", desc: "Content moderator" },
      { label: "Manager", desc: "Team or content manager" },
    ],
  },
  {
    id: "integrations", label: "Integrations", icon: Plug, color: "#fb923c",
    items: [
      { label: "Stripe", desc: "Payment processing" },
      { label: "SendGrid", desc: "Email delivery" },
      { label: "Google OAuth", desc: "Social login" },
      { label: "AWS S3", desc: "File storage" },
      { label: "Twilio", desc: "SMS notifications" },
      { label: "Analytics", desc: "Usage tracking" },
    ],
  },
  {
    id: "workflows", label: "Workflows", icon: GitBranch, color: "#e879f9",
    items: [
      { label: "User Registration", desc: "Account creation flow" },
      { label: "Purchase Flow", desc: "Checkout process" },
      { label: "Password Reset", desc: "Account recovery" },
      { label: "Onboarding", desc: "New user setup" },
      { label: "Approval Flow", desc: "Review and approve" },
    ],
  },
];

const TYPE_MAP: Record<string, NodeType> = {
  pages: "page",
  features: "feature",
  "user-roles": "user-role",
  integrations: "integration",
  workflows: "workflow",
};

interface LeftPanelProps {
  onAddNode: (type: NodeType, label: string, desc: string) => void;
}

export function LeftPanel({ onAddNode }: LeftPanelProps) {
  const [expanded, setExpanded] = useState<string[]>(["pages", "features"]);

  const toggle = (id: string) =>
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="w-56 flex-shrink-0 bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col overflow-hidden">
      <div className="px-3 py-3 border-b border-[#1a1a1a]">
        <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">Components</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {PANEL_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = expanded.includes(section.id);
          const nodeType = TYPE_MAP[section.id];
          return (
            <div key={section.id} className="border-b border-[#1a1a1a]">
              <button
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#141414] transition-colors"
                onClick={() => toggle(section.id)}
              >
                <Icon size={13} style={{ color: section.color }} />
                <span className="text-[12px] font-medium text-[#999] flex-1 text-left">{section.label}</span>
                {isOpen ? <ChevronDown size={11} className="text-[#555]" /> : <ChevronRight size={11} className="text-[#555]" />}
              </button>
              {isOpen && (
                <div className="pb-1">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#141414] transition-colors group text-left"
                      onClick={() => onAddNode(nodeType, item.label, item.desc)}
                      title={`Add ${item.label}`}
                    >
                      <GripVertical size={10} className="text-[#333] group-hover:text-[#555] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[#999] group-hover:text-white transition-colors truncate">{item.label}</p>
                        <p className="text-[10px] text-[#333] truncate">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
