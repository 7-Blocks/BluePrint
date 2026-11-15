"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileText, Zap, Users, Plug, GitBranch, GraduationCap, BookOpen, Shield, ShoppingCart, CreditCard, Bell, Search, Upload, MessageSquare, Star, BarChart } from "lucide-react";
import type { NodeType } from "@/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Zap, Users, Plug, GitBranch, GraduationCap, BookOpen, Shield,
  ShoppingCart, CreditCard, Bell, Search, Upload, MessageSquare, Star, BarChart,
};

const TYPE_CONFIG: Record<NodeType, { color: string; bg: string; border: string; defaultIcon: React.ElementType }> = {
  page: { color: "#a78bfa", bg: "rgba(106,76,245,0.08)", border: "rgba(106,76,245,0.25)", defaultIcon: FileText },
  feature: { color: "#60a5fa", bg: "rgba(0,153,255,0.08)", border: "rgba(0,153,255,0.25)", defaultIcon: Zap },
  "user-role": { color: "#4ade80", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", defaultIcon: Users },
  integration: { color: "#fb923c", bg: "rgba(255,122,61,0.08)", border: "rgba(255,122,61,0.25)", defaultIcon: Plug },
  workflow: { color: "#e879f9", bg: "rgba(212,77,240,0.08)", border: "rgba(212,77,240,0.25)", defaultIcon: GitBranch },
};

function BaseNode({ data, selected, type }: NodeProps) {
  const nodeType = (type as NodeType) || "page";
  const config = TYPE_CONFIG[nodeType] || TYPE_CONFIG.page;
  const d = data as Record<string, unknown>;
  const label = (d.label as string) || "Untitled";
  const description = d.description as string | undefined;
  const path = d.path as string | undefined;
  const priority = d.priority as string | undefined;
  const steps = d.steps as string[] | undefined;
  const icon = d.icon as string | undefined;
  const IconComponent = (icon && ICON_MAP[icon]) || config.defaultIcon;

  return (
    <div
      className="relative min-w-[160px] max-w-[200px] rounded-[12px] border transition-all duration-150 cursor-pointer hover:shadow-lg"
      style={{
        background: selected ? config.bg : "#141414",
        borderColor: selected ? config.color : "#262626",
        boxShadow: selected ? `0 0 0 1px ${config.color}40, 0 4px 20px ${config.color}15` : "none",
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#262626] !border-[#333]" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#262626] !border-[#333]" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-[#262626] !border-[#333]" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-[#262626] !border-[#333]" />

      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: config.bg, border: `1px solid ${config.border}` }}>
            <IconComponent size={12} style={{ color: config.color }} />
          </div>
          <span className="text-[13px] font-semibold text-white truncate leading-tight">{label}</span>
        </div>
        {description && (
          <p className="text-[11px] text-[#555] leading-relaxed line-clamp-2">{description}</p>
        )}
        {nodeType === "page" && path && (
          <div className="mt-1.5 px-1.5 py-0.5 rounded-[4px] bg-[#1c1c1c] inline-block">
            <span className="text-[10px] text-[#555] font-mono">{path}</span>
          </div>
        )}
        {nodeType === "feature" && priority && (
          <div className="mt-1.5">
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", {
              "bg-red-500/10 text-red-400": priority === "critical",
              "bg-blue-500/10 text-blue-400": priority === "high",
              "bg-orange-500/10 text-orange-400": priority === "medium",
              "bg-[#1c1c1c] text-[#555]": priority === "low",
            })}>
              {priority}
            </span>
          </div>
        )}
        {nodeType === "workflow" && steps && (
          <div className="mt-1.5 text-[10px] text-[#555]">{steps.length} steps</div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[12px]" style={{ background: config.color, opacity: 0.6 }} />
    </div>
  );
}

export const PageNode = memo((props: NodeProps) => <BaseNode {...props} type="page" />);
export const FeatureNode = memo((props: NodeProps) => <BaseNode {...props} type="feature" />);
export const UserRoleNode = memo((props: NodeProps) => <BaseNode {...props} type="user-role" />);
export const IntegrationNode = memo((props: NodeProps) => <BaseNode {...props} type="integration" />);
export const WorkflowNode = memo((props: NodeProps) => <BaseNode {...props} type="workflow" />);

PageNode.displayName = "PageNode";
FeatureNode.displayName = "FeatureNode";
UserRoleNode.displayName = "UserRoleNode";
IntegrationNode.displayName = "IntegrationNode";
WorkflowNode.displayName = "WorkflowNode";

export const NODE_TYPES = {
  page: PageNode,
  feature: FeatureNode,
  "user-role": UserRoleNode,
  integration: IntegrationNode,
  workflow: WorkflowNode,
};
