import { cn } from "@/lib/utils";
import type { ProjectStatus, NodeType, Priority } from "@/types";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full", className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const map = {
    draft: { label: "Draft", className: "bg-[#1c1c1c] text-[#999] border border-[#262626]" },
    "in-review": { label: "In Review", className: "bg-[#0099ff]/10 text-[#0099ff] border border-[#0099ff]/20" },
    approved: { label: "Approved", className: "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20" },
  };
  const { label, className } = map[status];
  return <Badge className={className}>{label}</Badge>;
}

export function NodeTypeBadge({ type }: { type: NodeType }) {
  const map: Record<NodeType, { label: string; className: string }> = {
    page: { label: "Page", className: "bg-[#6a4cf5]/15 text-[#a78bfa]" },
    feature: { label: "Feature", className: "bg-[#0099ff]/15 text-[#60a5fa]" },
    "user-role": { label: "User Role", className: "bg-[#22c55e]/15 text-[#4ade80]" },
    integration: { label: "Integration", className: "bg-[#ff7a3d]/15 text-[#fb923c]" },
    workflow: { label: "Workflow", className: "bg-[#d44df0]/15 text-[#e879f9]" },
  };
  const { label, className } = map[type];
  return <Badge className={className}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; className: string }> = {
    low: { label: "Low", className: "bg-[#1c1c1c] text-[#999]" },
    medium: { label: "Medium", className: "bg-[#ff7a3d]/10 text-[#fb923c]" },
    high: { label: "High", className: "bg-[#0099ff]/10 text-[#60a5fa]" },
    critical: { label: "Critical", className: "bg-red-500/10 text-red-400" },
  };
  const { label, className } = map[priority];
  return <Badge className={className}>{label}</Badge>;
}
