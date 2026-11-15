"use client";
  import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, FileText, Zap, Users, GitBranch } from "lucide-react";
import { getProjectByShareId } from "@/lib/storage";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project, CanvasNode, NodeType } from "@/types";

const TYPE_CONFIG: Record<NodeType, { color: string; label: string; icon: React.ElementType }> = {
  page: { color: "#a78bfa", label: "Page", icon: FileText },
  feature: { color: "#60a5fa", label: "Feature", icon: Zap },
  "user-role": { color: "#4ade80", label: "User Role", icon: Users },
  integration: { color: "#fb923c", label: "Integration", icon: Zap },
  workflow: { color: "#e879f9", label: "Workflow", icon: GitBranch },
};

export default function SharePage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [project, setProject] = useState<Project | null>(null);
  const [selected, setSelected] = useState<CanvasNode | null>(null);

  useEffect(() => {
    const p = getProjectByShareId(shareId);
    setProject(p || null);
  }, [shareId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] font-medium text-white mb-2">Project not found</p>
          <p className="text-[14px] text-[#555]">This link may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  const pages = project.nodes.filter((n) => n.type === "page");
  const features = project.nodes.filter((n) => n.type === "feature");
  const roles = project.nodes.filter((n) => n.type === "user-role");
  const workflows = project.nodes.filter((n) => n.type === "workflow");

  return (
    <div className="min-h-screen bg-[#090909]">
      <div className="border-b border-[#1a1a1a] bg-[#090909]">
        <div className="max-w-[1000px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="#090909" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="#090909" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="#090909" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="#090909" opacity="0.4" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-white">Blueprint</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Link href="/signup">
              <Button variant="primary" size="sm">Create your own</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-[36px] font-semibold text-white tracking-tight mb-2">{project.name}</h1>
          <p className="text-[16px] text-[#999] leading-relaxed max-w-[600px]">{project.description}</p>
          {project.status === "approved" && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full">
              <CheckCircle size={14} className="text-[#22c55e]" />
              <span className="text-[13px] font-medium text-[#22c55e]">Scope approved by client</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[
              { title: "Who will use this?", nodes: roles },
              { title: "Pages & Screens", nodes: pages },
              { title: "Features", nodes: features },
              { title: "How things work", nodes: workflows },
            ].map(({ title, nodes: sectionNodes }) => (
              <div key={title}>
                <h2 className="text-[16px] font-semibold text-white mb-3">{title}</h2>
                {sectionNodes.length === 0 ? (
                  <p className="text-[13px] text-[#333] italic">Not defined</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {sectionNodes.map((node) => {
                      const config = TYPE_CONFIG[node.type];
                      const Icon = config.icon;
                      const isSelected = selected?.id === node.id;
                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelected(isSelected ? null : node)}
                          className={`text-left p-4 rounded-[15px] border transition-all ${isSelected ? "bg-[#1c1c1c] border-[#0099ff]/40" : "bg-[#141414] border-[#262626] hover:border-[#333]"}`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: `${config.color}15` }}>
                              <Icon size={12} style={{ color: config.color }} />
                            </div>
                            <span className="text-[13px] font-medium text-white">{node.data.label}</span>
                          </div>
                          {node.data.description && <p className="text-[12px] text-[#555] leading-relaxed">{node.data.description as string}</p>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {selected && (
              <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-5 animate-fade-in">
                <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-2">
                  {TYPE_CONFIG[selected.type].label}
                </p>
                <h3 className="text-[16px] font-semibold text-white mb-2">{selected.data.label}</h3>
                {selected.data.description && <p className="text-[13px] text-[#999] leading-relaxed">{selected.data.description as string}</p>}
                {selected.type === "workflow" && selected.data.steps && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Steps</p>
                    {(selected.data.steps as string[]).map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[11px] text-[#555] w-4 flex-shrink-0">{i + 1}.</span>
                        <span className="text-[12px] text-[#999]">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-5">
              <h3 className="text-[14px] font-semibold text-white mb-1">Project summary</h3>
              <div className="space-y-2 mt-3">
                {[
                  { label: "Pages", count: pages.length },
                  { label: "Features", count: features.length },
                  { label: "User roles", count: roles.length },
                  { label: "Workflows", count: workflows.length },
                ].map(({ label, count }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[13px] text-[#555]">{label}</span>
                    <span className="text-[13px] font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#6a4cf5]/10 border border-[#6a4cf5]/20 rounded-[20px] p-5">
              <h3 className="text-[14px] font-semibold text-white mb-1">Build your own</h3>
              <p className="text-[12px] text-[#999] mb-4">Create visual project plans like this one with Blueprint.</p>
              <Link href="/signup">
                <Button variant="primary" size="sm" className="w-full">Get started free</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
