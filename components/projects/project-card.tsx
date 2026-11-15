"use client";
import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Trash2, ExternalLink, GitBranch, Clock, Share2 } from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  website: "Website",
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  ecommerce: "E-commerce",
  saas: "SaaS",
  other: "Other",
};

const NODE_COLORS: Record<string, string> = {
  page: "#6a4cf5",
  feature: "#0099ff",
  "user-role": "#22c55e",
  integration: "#ff7a3d",
  workflow: "#d44df0",
};

function MiniMap({ nodes }: { nodes: Project["nodes"] }) {
  if (!nodes.length) return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-[11px] text-[#333]">No nodes yet</span>
    </div>
  );

  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs) + 120;
  const minY = Math.min(...ys), maxY = Math.max(...ys) + 40;
  const scaleX = 200 / (maxX - minX || 1);
  const scaleY = 80 / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY, 0.3);

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
      {nodes.slice(0, 20).map((n) => {
        const x = (n.position.x - minX) * scale + 10;
        const y = (n.position.y - minY) * scale + 10;
        const color = NODE_COLORS[n.type] || "#555";
        return (
          <g key={n.id}>
            <rect x={x} y={y} width={Math.max(40, n.data.label.length * 5)} height={14} rx={3} fill={color} opacity={0.15} />
            <rect x={x} y={y} width={Math.max(40, n.data.label.length * 5)} height={14} rx={3} fill="none" stroke={color} strokeWidth={0.5} opacity={0.4} />
          </g>
        );
      })}
    </svg>
  );
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  view: "grid" | "list";
}

export function ProjectCard({ project, onDelete, view }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete(project.id);
    setMenuOpen(false);
    setConfirmDelete(false);
  };

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-[#141414] border border-[#262626] rounded-[12px] hover:border-[#333] transition-colors group">
        <div className="w-8 h-8 rounded-[8px] bg-[#1c1c1c] flex items-center justify-center flex-shrink-0">
          <GitBranch size={14} className="text-[#555]" />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/projects/${project.id}/editor`}>
            <span className="text-[14px] font-medium text-white hover:text-[#0099ff] transition-colors">{project.name}</span>
          </Link>
          <p className="text-[12px] text-[#555] truncate">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
        <span className="text-[12px] text-[#555] hidden sm:block">{TYPE_LABELS[project.type]}</span>
        <span className="text-[12px] text-[#555] hidden md:block">{formatDate(project.updatedAt)}</span>
        <span className="text-[12px] text-[#333]">{project.version}</span>
        <div className="relative">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#555] hover:text-white hover:bg-[#1c1c1c] transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && <CardMenu project={project} onDelete={handleDelete} confirmDelete={confirmDelete} onClose={() => { setMenuOpen(false); setConfirmDelete(false); }} />}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-[20px] overflow-hidden hover:border-[#333] transition-all duration-200 group flex flex-col">
      {/* Thumbnail */}
      <Link href={`/projects/${project.id}/editor`}>
        <div className="h-[120px] bg-[#0f0f0f] border-b border-[#1a1a1a] overflow-hidden relative"
          style={{ backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
          <MiniMap nodes={project.nodes} />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <Link href={`/projects/${project.id}/editor`}>
              <h3 className="text-[15px] font-semibold text-white hover:text-[#0099ff] transition-colors truncate">{project.name}</h3>
            </Link>
            <p className="text-[12px] text-[#555] mt-0.5">{TYPE_LABELS[project.type]}</p>
          </div>
          <div className="relative flex-shrink-0">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#555] hover:text-white hover:bg-[#1c1c1c] transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Project options"
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && <CardMenu project={project} onDelete={handleDelete} confirmDelete={confirmDelete} onClose={() => { setMenuOpen(false); setConfirmDelete(false); }} />}
          </div>
        </div>

        <p className="text-[13px] text-[#555] leading-relaxed line-clamp-2 mb-3 flex-1">{project.description}</p>

        <div className="flex items-center justify-between">
          <StatusBadge status={project.status} />
          <div className="flex items-center gap-1 text-[11px] text-[#333]">
            <Clock size={10} />
            <span>{formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardMenu({ project, onDelete, confirmDelete, onClose }: {
  project: Project;
  onDelete: () => void;
  confirmDelete: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 w-44 bg-[#141414] border border-[#262626] rounded-[12px] overflow-hidden z-50 shadow-xl">
        <div className="p-1">
          <Link href={`/projects/${project.id}/editor`} onClick={onClose}>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-[#999] hover:text-white hover:bg-[#1c1c1c] transition-colors">
              <ExternalLink size={13} /> Open editor
            </button>
          </Link>
          <Link href={`/projects/${project.id}/review`} onClick={onClose}>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-[#999] hover:text-white hover:bg-[#1c1c1c] transition-colors">
              <Share2 size={13} /> Client view
            </button>
          </Link>
          <div className="h-px bg-[#1a1a1a] my-1" />
          <button
            onClick={onDelete}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] transition-colors",
              confirmDelete ? "text-white bg-red-500/20" : "text-red-400 hover:bg-red-500/10"
            )}
          >
            <Trash2 size={13} />
            {confirmDelete ? "Confirm delete" : "Delete project"}
          </button>
        </div>
      </div>
    </>
  );
}
