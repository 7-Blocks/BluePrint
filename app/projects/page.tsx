"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Grid3X3, List, Plus, Sparkles } from "lucide-react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import type { ProjectStatus } from "@/types";
import { toast } from "sonner";

const STATUS_FILTERS: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "In Review", value: "in-review" },
  { label: "Approved", value: "approved" },
];

export default function ProjectsPage() {
  const { projects, loadProjects, removeProject, initAuth } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    initAuth();
    loadProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    removeProject(id);
    toast.success("Project deleted");
  };

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Projects</h1>
            <p className="text-[14px] text-[#555] mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace</p>
          </div>
          <Link href="/projects/new">
            <Button variant="primary" size="md" className="gap-2">
              <Plus size={15} /> New project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-full pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#0099ff]/50 transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-[#141414] border border-[#262626] rounded-full p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                  statusFilter === f.value ? "bg-[#1c1c1c] text-white" : "text-[#555] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-[#141414] border border-[#262626] rounded-full p-1">
            <button
              onClick={() => setView("grid")}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${view === "grid" ? "bg-[#1c1c1c] text-white" : "text-[#555] hover:text-white"}`}
              aria-label="Grid view"
            >
              <Grid3X3 size={13} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${view === "list" ? "bg-[#1c1c1c] text-white" : "text-[#555] hover:text-white"}`}
              aria-label="List view"
            >
              <List size={13} />
            </button>
          </div>
        </div>

        {/* Projects */}
        {filtered.length === 0 ? (
          <EmptyState hasProjects={projects.length > 0} />
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} view="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} view="list" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ hasProjects }: { hasProjects: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-[20px] bg-[#141414] border border-[#262626] flex items-center justify-center mb-6">
        <Sparkles size={24} className="text-[#333]" />
      </div>
      <h2 className="text-[22px] font-semibold text-white tracking-tight mb-2">
        {hasProjects ? "No projects match your search" : "Your next great project starts with an idea."}
      </h2>
      <p className="text-[15px] text-[#555] max-w-[320px] mb-8">
        {hasProjects
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Create a visual project plan that your clients will actually understand."}
      </p>
      {!hasProjects && (
        <Link href="/projects/new">
          <Button variant="primary" size="lg" className="gap-2">
            <Plus size={15} /> Create your first project
          </Button>
        </Link>
      )}
    </div>
  );
}
