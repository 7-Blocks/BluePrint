"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, FileText, Zap, Users, GitBranch, Check, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ApprovalPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { projects, loadProjects, updateProject, initAuth } = useAppStore();
  const [approveModal, setApproveModal] = useState(false);
  const [changesModal, setChangesModal] = useState(false);
  const [changesFeedback, setChangesFeedback] = useState("");
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleApprove = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    updateProject(projectId, { status: "approved" });
    setApproved(true);
    setApproveModal(false);
    setLoading(false);
    toast.success("Project scope approved!");
  };

  const handleRequestChanges = async () => {
    if (!changesFeedback.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateProject(projectId, { status: "in-review" });
    setChangesModal(false);
    setChangesFeedback("");
    setLoading(false);
    toast.success("Change request submitted");
  };

  if (approved || project.status === "approved") {
    return (
      <div className="min-h-screen bg-[#090909]">
        <AppNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
          <div className="text-center max-w-[400px] px-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-[#22c55e]" />
            </div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-3">Scope approved!</h1>
            <p className="text-[15px] text-[#999] leading-relaxed mb-8">
              The project scope for <strong className="text-white">{project.name}</strong> has been approved. Development can now begin with a clear, agreed-upon plan.
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/projects/${projectId}/editor`}>
                <Button variant="primary" size="lg" className="w-full">View project editor</Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg" className="w-full">Back to projects</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />
      <main className="max-w-[900px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/projects/${projectId}/review`} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[24px] font-semibold text-white tracking-tight">{project.name}</h1>
            <p className="text-[13px] text-[#555]">Scope approval</p>
          </div>
          <div className="ml-auto">
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Approval banner */}
        <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#0099ff]/10 border border-[#0099ff]/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-[#0099ff]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[16px] font-semibold text-white mb-1">Review and approve the project scope</h2>
              <p className="text-[14px] text-[#999] leading-relaxed">
                Please review all sections below carefully. Once approved, this scope document serves as the agreed-upon plan for development.
              </p>
            </div>
          </div>
        </div>

        {/* Project overview */}
        <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-6 mb-4">
          <h3 className="text-[15px] font-semibold text-white mb-4">Project overview</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1">Project name</p>
              <p className="text-[14px] text-white">{project.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1">Type</p>
              <p className="text-[14px] text-white capitalize">{project.type.replace("-", " ")}</p>
            </div>
            {project.objective && (
              <div className="sm:col-span-2">
                <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1">Objective</p>
                <p className="text-[14px] text-white">{project.objective}</p>
              </div>
            )}
            {project.audience && (
              <div className="sm:col-span-2">
                <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1">Target audience</p>
                <p className="text-[14px] text-white">{project.audience}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scope sections */}
        {[
          { title: "User roles", icon: Users, color: "#4ade80", items: roles, key: "user-role" },
          { title: "Pages & screens", icon: FileText, color: "#a78bfa", items: pages, key: "page" },
          { title: "Features & functionality", icon: Zap, color: "#60a5fa", items: features, key: "feature" },
          { title: "Workflows", icon: GitBranch, color: "#e879f9", items: workflows, key: "workflow" },
        ].map(({ title, icon: Icon, color, items }) => (
          <div key={title} className="bg-[#141414] border border-[#262626] rounded-[20px] overflow-hidden mb-4">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1a1a1a]">
              <Icon size={15} style={{ color }} />
              <h3 className="text-[14px] font-semibold text-white">{title}</h3>
              <span className="text-[12px] text-[#555] ml-auto">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>
            {items.length === 0 ? (
              <p className="px-5 py-4 text-[13px] text-[#333] italic">None defined</p>
            ) : (
              <div className="divide-y divide-[#1a1a1a]">
                {items.map((node) => (
                  <div key={node.id} className="flex items-start gap-3 px-5 py-3">
                    <Check size={13} className="text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-white">{node.data.label}</p>
                      {node.data.description && <p className="text-[12px] text-[#555] mt-0.5">{node.data.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Out of scope */}
        <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-5 mb-8">
          <h3 className="text-[14px] font-semibold text-white mb-3">Out of scope</h3>
          <div className="space-y-2">
            {["Mobile native applications (web-responsive only)", "Third-party API integrations not listed above", "Content creation and data migration", "Ongoing maintenance after launch"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <XCircle size={13} className="text-[#555] flex-shrink-0" />
                <span className="text-[13px] text-[#555]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="lg" className="flex-1 gap-2" onClick={() => setChangesModal(true)}>
            <XCircle size={16} /> Request changes
          </Button>
          <Button variant="primary" size="lg" className="flex-1 gap-2" onClick={() => setApproveModal(true)}>
            <CheckCircle size={16} /> Approve project scope
          </Button>
        </div>
      </main>

      {/* Approve modal */}
      <Modal open={approveModal} onClose={() => setApproveModal(false)} title="Confirm approval" size="sm">
        <div className="space-y-4">
          <p className="text-[14px] text-[#999] leading-relaxed">
            By approving, you confirm that the project scope accurately represents what will be built. This serves as a reference document throughout development.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setApproveModal(false)}>Cancel</Button>
            <Button variant="primary" size="md" className="flex-1 gap-2" loading={loading} onClick={handleApprove}>
              <CheckCircle size={14} /> Confirm approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* Changes modal */}
      <Modal open={changesModal} onClose={() => setChangesModal(false)} title="Request changes" size="sm">
        <div className="space-y-4">
          <p className="text-[14px] text-[#999]">Describe what needs to be changed or clarified.</p>
          <textarea
            value={changesFeedback}
            onChange={(e) => setChangesFeedback(e.target.value)}
            placeholder="e.g. We need to add a mobile app version, and the payment section needs more detail..."
            rows={5}
            className="w-full bg-[#1c1c1c] border border-[#262626] rounded-[10px] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#0099ff]/50 resize-none"
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setChangesModal(false)}>Cancel</Button>
            <Button variant="primary" size="md" className="flex-1" loading={loading} onClick={handleRequestChanges} disabled={!changesFeedback.trim()}>
              Submit request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
