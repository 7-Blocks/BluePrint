"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitBranch, Clock, User, Plus, Minus, Equal } from "lucide-react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { formatDate } from "@/lib/utils";

export default function VersionsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { projects, loadProjects, initAuth } = useAppStore();
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
    loadProjects();
  }, []);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return <div className="min-h-screen bg-[#090909]"><AppNav /><div className="flex items-center justify-center h-64"><p className="text-[#555]">Project not found</p></div></div>;

  const versions = project.versions;

  const MOCK_DIFF = {
    added: ["Progress Tracking feature", "Admin Settings page", "Notifications feature"],
    removed: ["Basic Search (replaced by Advanced Search)"],
    modified: ["Authentication — added Google OAuth support", "Course Details page — added video preview section"],
    unchanged: ["Home page", "Login page", "Registration page", "Student Profile"],
  };

  const vA = versions.find((v) => v.id === compareA);
  const vB = versions.find((v) => v.id === compareB);

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/projects/${projectId}/editor`} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[24px] font-semibold text-white tracking-tight">{project.name}</h1>
            <p className="text-[13px] text-[#555]">Version history</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#141414] border border-[#262626] rounded-[20px] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1a1a1a]">
                <h2 className="text-[14px] font-semibold text-white">All versions</h2>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {versions.length === 0 ? (
                  <div className="p-6 text-center">
                    <GitBranch size={20} className="text-[#333] mx-auto mb-2" />
                    <p className="text-[13px] text-[#555]">No versions yet</p>
                  </div>
                ) : (
                  versions.map((v, i) => {
                    const isLatest = i === versions.length - 1;
                    const isSelectedA = compareA === v.id;
                    const isSelectedB = compareB === v.id;
                    return (
                      <div key={v.id} className="p-4 hover:bg-[#1c1c1c] transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[13px] font-semibold text-white">{v.version}</span>
                              {isLatest && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">Latest</span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#999] leading-relaxed mb-2">{v.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-[#555]">
                              <div className="flex items-center gap-1"><User size={10} />{v.author}</div>
                              <div className="flex items-center gap-1"><Clock size={10} />{formatDate(v.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 mt-3">
                          <button
                            onClick={() => setCompareA(isSelectedA ? null : v.id)}
                            className={`flex-1 py-1 rounded-[6px] text-[11px] font-medium transition-colors border ${isSelectedA ? "bg-[#6a4cf5]/20 border-[#6a4cf5]/40 text-[#a78bfa]" : "bg-transparent border-[#262626] text-[#555] hover:text-white"}`}
                          >
                            {isSelectedA ? "A ✓" : "Select A"}
                          </button>
                          <button
                            onClick={() => setCompareB(isSelectedB ? null : v.id)}
                            className={`flex-1 py-1 rounded-[6px] text-[11px] font-medium transition-colors border ${isSelectedB ? "bg-[#0099ff]/20 border-[#0099ff]/40 text-[#60a5fa]" : "bg-transparent border-[#262626] text-[#555] hover:text-white"}`}
                          >
                            {isSelectedB ? "B ✓" : "Select B"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {compareA && compareB ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#6a4cf5]/10 border border-[#6a4cf5]/20 rounded-full">
                    <span className="text-[12px] font-medium text-[#a78bfa]">A: {vA?.version}</span>
                  </div>
                  <span className="text-[#333]">→</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0099ff]/10 border border-[#0099ff]/20 rounded-full">
                    <span className="text-[12px] font-medium text-[#60a5fa]">B: {vB?.version}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Added", items: MOCK_DIFF.added, icon: Plus, color: "#22c55e", bg: "bg-[#22c55e]/5", border: "border-[#22c55e]/10" },
                    { label: "Removed", items: MOCK_DIFF.removed, icon: Minus, color: "#f87171", bg: "bg-red-500/5", border: "border-red-500/10" },
                    { label: "Modified", items: MOCK_DIFF.modified, icon: Equal, color: "#fb923c", bg: "bg-[#ff7a3d]/5", border: "border-[#ff7a3d]/10" },
                  ].map(({ label, items, icon: Icon, color, bg, border }) => (
                    <div key={label} className="bg-[#141414] border border-[#262626] rounded-[20px] overflow-hidden">
                      <div className={`flex items-center gap-2 px-5 py-3 border-b border-[#1a1a1a] ${bg}`}>
                        <Icon size={14} style={{ color }} />
                        <span className="text-[13px] font-semibold" style={{ color }}>{label} ({items.length})</span>
                      </div>
                      <div className="p-4 space-y-2">
                        {items.map((item) => (
                          <div key={item} className={`flex items-center gap-2.5 px-3 py-2 ${bg} ${border} border rounded-[8px]`}>
                            <Icon size={11} style={{ color }} className="flex-shrink-0" />
                            <span className="text-[13px] text-white">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="bg-[#141414] border border-[#262626] rounded-[20px] overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a1a1a]">
                      <span className="text-[13px] font-semibold text-[#555]">Unchanged ({MOCK_DIFF.unchanged.length})</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {MOCK_DIFF.unchanged.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 px-3 py-2 bg-[#1c1c1c] rounded-[8px]">
                          <span className="text-[13px] text-[#555]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#141414] border border-[#262626] rounded-[20px] p-12 text-center">
                <div>
                  <GitBranch size={32} className="text-[#333] mx-auto mb-4" />
                  <h3 className="text-[16px] font-semibold text-white mb-2">Compare versions</h3>
                  <p className="text-[14px] text-[#555] max-w-[280px]">Select version A and version B from the list to see what changed between them.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
