"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, RefreshCw, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { Button } from "@/components/ui/button";
import { generateProjectStructure } from "@/lib/services/ai-service";
import { toast } from "sonner";

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { projects, loadProjects, updateProject, initAuth } = useAppStore();
  const [regenerating, setRegenerate] = useState(false);

  useEffect(() => {
    initAuth();
    loadProjects();
  }, []);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return <div className="min-h-screen bg-[#090909]"><AppNav /></div>;

  const pages = project.nodes.filter((n) => n.type === "page");
  const features = project.nodes.filter((n) => n.type === "feature");
  const roles = project.nodes.filter((n) => n.type === "user-role");
  const workflows = project.nodes.filter((n) => n.type === "workflow");

  const handleRegenerate = async () => {
    setRegenerate(true);
    await new Promise((r) => setTimeout(r, 1500));
    const structure = generateProjectStructure(project.description, project.type);
    updateProject(projectId, { nodes: structure.nodes, edges: structure.edges });
    setRegenerate(false);
    toast.success("Structure regenerated");
  };

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />
      <main className="max-w-[900px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/projects/${projectId}/editor`} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[24px] font-semibold text-white tracking-tight">Generated structure</h1>
            <p className="text-[13px] text-[#555]">{project.name}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" className="gap-1.5" loading={regenerating} onClick={handleRegenerate}>
              <RefreshCw size={13} /> Regenerate
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5" onClick={() => router.push(`/projects/${projectId}/editor`)}>
              Open editor <ArrowRight size={13} />
            </Button>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-5 mb-6">
          <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-2">Original description</p>
          <p className="text-[14px] text-[#999] leading-relaxed">{project.description}</p>
        </div>

        {[
          { title: "User roles", items: roles, color: "#4ade80" },
          { title: "Pages", items: pages, color: "#a78bfa" },
          { title: "Features", items: features, color: "#60a5fa" },
          { title: "Workflows", items: workflows, color: "#e879f9" },
        ].map(({ title, items, color }) => (
          <div key={title} className="mb-4">
            <h3 className="text-[14px] font-semibold text-white mb-3">{title} <span className="text-[#555] font-normal">({items.length})</span></h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {items.map((node) => (
                <div key={node.id} className="flex items-start gap-3 p-3.5 bg-[#141414] border border-[#262626] rounded-[12px]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Check size={10} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">{node.data.label}</p>
                    {node.data.description && <p className="text-[11px] text-[#555] mt-0.5">{node.data.description as string}</p>}
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-[13px] text-[#333] italic col-span-2">None generated</p>}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
