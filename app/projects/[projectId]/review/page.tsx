"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, CheckCircle, ArrowLeft, Send, Check, X, ChevronRight, Users, FileText, Zap, GitBranch } from "lucide-react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { CanvasNode, NodeType } from "@/types";
import { toast } from "sonner";

const TYPE_CONFIG: Record<NodeType, { color: string; label: string; icon: React.ElementType }> = {
  page: { color: "#a78bfa", label: "Page", icon: FileText },
  feature: { color: "#60a5fa", label: "Feature", icon: Zap },
  "user-role": { color: "#4ade80", label: "User Role", icon: Users },
  integration: { color: "#fb923c", label: "Integration", icon: Zap },
  workflow: { color: "#e879f9", label: "Workflow", icon: GitBranch },
};

export default function ReviewPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { projects, loadProjects, addComment, resolveComment, addReply, initAuth } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentModal, setCommentModal] = useState(false);

  useEffect(() => {
    initAuth();
    loadProjects();
  }, []);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return <div className="min-h-screen bg-[#090909] flex items-center justify-center"><p className="text-[#555]">Project not found</p></div>;

  const allComments = project.comments;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(projectId, {
      nodeId: selectedNode?.id,
      author: "Sarah Chen",
      authorRole: "client",
      content: commentText,
      resolved: false,
    });
    setCommentText("");
    setCommentModal(false);
    toast.success("Comment added");
  };

  const handleReply = (commentId: string) => {
    const text = replyText[commentId];
    if (!text?.trim()) return;
    addReply(projectId, commentId, text);
    setReplyText((r) => ({ ...r, [commentId]: "" }));
    setReplyingTo(null);
    toast.success("Reply added");
  };

  const pages = project.nodes.filter((n) => n.type === "page");
  const features = project.nodes.filter((n) => n.type === "feature");
  const roles = project.nodes.filter((n) => n.type === "user-role");
  const workflows = project.nodes.filter((n) => n.type === "workflow");

  return (
    <div className="min-h-screen bg-[#090909]">
      <div className="sticky top-0 z-40 bg-[#090909]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/projects" className="text-[#555] hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-[15px] font-semibold text-white">{project.name}</h1>
              <p className="text-[11px] text-[#555]">Project review</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Link href={`/projects/${projectId}/approval`}>
              <Button variant="primary" size="sm" className="gap-1.5">
                <CheckCircle size={13} /> Review & Approve
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-6">
              <h2 className="text-[18px] font-semibold text-white mb-1">{project.name}</h2>
              <p className="text-[14px] text-[#999] leading-relaxed mb-4">{project.description}</p>
              {project.objective && (
                <div className="bg-[#1c1c1c] rounded-[12px] p-4">
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1">Objective</p>
                  <p className="text-[14px] text-white">{project.objective}</p>
                </div>
              )}
              {project.audience && (
                <div className="bg-[#1c1c1c] rounded-[12px] p-4 mt-3">
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1">Who is this for?</p>
                  <p className="text-[14px] text-white">{project.audience}</p>
                </div>
              )}
            </div>

            {[
              { title: "Who will use this?", nodes: roles, emptyMsg: "No user roles defined" },
              { title: "Pages & Screens", nodes: pages, emptyMsg: "No pages defined" },
              { title: "Features & Functionality", nodes: features, emptyMsg: "No features defined" },
              { title: "How things work", nodes: workflows, emptyMsg: "No workflows defined" },
            ].map(({ title, nodes: sectionNodes, emptyMsg }) => (
              <div key={title}>
                <h3 className="text-[15px] font-semibold text-white mb-3">{title}</h3>
                {sectionNodes.length === 0 ? (
                  <p className="text-[13px] text-[#333] italic">{emptyMsg}</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {sectionNodes.map((node) => {
                      const config = TYPE_CONFIG[node.type];
                      const Icon = config.icon;
                      const nodeCommentCount = project.comments.filter((c) => c.nodeId === node.id && !c.resolved).length;
                      const isSelected = selectedNode?.id === node.id;
                      return (
                        <button
                          key={node.id}
                          onClick={() => { setSelectedNode(isSelected ? null : node); setCommentModal(false); }}
                          className={`text-left p-4 rounded-[15px] border transition-all duration-150 ${
                            isSelected ? "bg-[#1c1c1c] border-[#0099ff]/40 ring-1 ring-[#0099ff]/20" : "bg-[#141414] border-[#262626] hover:border-[#333]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `${config.color}15`, border: `1px solid ${config.color}30` }}>
                                <Icon size={13} style={{ color: config.color }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[14px] font-medium text-white truncate">{node.data.label}</p>
                                {node.type === "page" && node.data.path && (
                                  <p className="text-[11px] text-[#555] font-mono">{node.data.path as string}</p>
                                )}
                              </div>
                            </div>
                            {nodeCommentCount > 0 && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <MessageSquare size={11} className="text-[#0099ff]" />
                                <span className="text-[11px] text-[#0099ff]">{nodeCommentCount}</span>
                              </div>
                            )}
                          </div>
                          {node.data.description && (
                            <p className="text-[12px] text-[#555] mt-2 leading-relaxed line-clamp-2">{node.data.description as string}</p>
                          )}
                          {node.type === "workflow" && node.data.steps && (
                            <div className="mt-2 space-y-1">
                              {(node.data.steps as string[]).slice(0, 3).map((step, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-[#333] w-3">{i + 1}.</span>
                                  <span className="text-[11px] text-[#555]">{step}</span>
                                </div>
                              ))}
                              {(node.data.steps as string[]).length > 3 && (
                                <p className="text-[10px] text-[#333]">+{(node.data.steps as string[]).length - 3} more steps</p>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {selectedNode && (
              <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-medium text-[#555] uppercase tracking-wider">
                    {TYPE_CONFIG[selectedNode.type].label} details
                  </span>
                  <button onClick={() => setSelectedNode(null)} className="text-[#555] hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2">{selectedNode.data.label}</h3>
                {selectedNode.data.description && <p className="text-[13px] text-[#999] leading-relaxed mb-3">{selectedNode.data.description as string}</p>}
                {selectedNode.type === "workflow" && selectedNode.data.steps && (
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">How this works</p>
                    {(selectedNode.data.steps as string[]).map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[11px] text-[#555] w-4 flex-shrink-0 mt-0.5">{i + 1}.</span>
                        <span className="text-[12px] text-[#999]">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="secondary" size="sm" className="w-full gap-2" onClick={() => setCommentModal(true)}>
                  <MessageSquare size={13} /> Leave a comment
                </Button>
              </div>
            )}

            <div className="bg-[#141414] border border-[#262626] rounded-[20px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
                <h3 className="text-[14px] font-semibold text-white">
                  Feedback {allComments.length > 0 && <span className="text-[#555]">({allComments.length})</span>}
                </h3>
                <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => { setSelectedNode(null); setCommentModal(true); }}>
                  <MessageSquare size={12} /> Add
                </Button>
              </div>

              {allComments.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare size={20} className="text-[#333] mx-auto mb-2" />
                  <p className="text-[13px] text-[#555]">No feedback yet</p>
                  <p className="text-[11px] text-[#333] mt-1">Click any block to leave a comment</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1a1a1a]">
                  {allComments.map((comment) => {
                    const relatedNode = project.nodes.find((n) => n.id === comment.nodeId);
                    return (
                      <div key={comment.id} className={`p-4 ${comment.resolved ? "opacity-50" : ""}`}>
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#6a4cf5] flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
                            {comment.author[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[12px] font-medium text-white">{comment.author}</span>
                              <span className="text-[10px] text-[#333]">{formatDate(comment.createdAt)}</span>
                              {comment.resolved && <span className="text-[10px] text-[#22c55e]">Resolved</span>}
                            </div>
                            {relatedNode && (
                              <div className="flex items-center gap-1 mb-1.5">
                                <ChevronRight size={10} className="text-[#333]" />
                                <span className="text-[10px] text-[#555]">{relatedNode.data.label}</span>
                              </div>
                            )}
                            <p className="text-[13px] text-[#999] leading-relaxed">{comment.content}</p>
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="mt-2 pl-3 border-l border-[#262626]">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[11px] font-medium text-white">{reply.author}</span>
                                  <span className="text-[10px] text-[#333]">{formatDate(reply.createdAt)}</span>
                                </div>
                                <p className="text-[12px] text-[#999]">{reply.content}</p>
                              </div>
                            ))}
                            {replyingTo === comment.id ? (
                              <div className="mt-2 flex gap-2">
                                <input
                                  value={replyText[comment.id] || ""}
                                  onChange={(e) => setReplyText((r) => ({ ...r, [comment.id]: e.target.value }))}
                                  placeholder="Write a reply..."
                                  className="flex-1 bg-[#1c1c1c] border border-[#262626] rounded-[8px] px-2.5 py-1.5 text-[12px] text-white placeholder:text-[#333] focus:outline-none focus:border-[#0099ff]/50"
                                  onKeyDown={(e) => { if (e.key === "Enter") handleReply(comment.id); }}
                                />
                                <button onClick={() => handleReply(comment.id)} className="text-[#0099ff] hover:text-white transition-colors">
                                  <Send size={13} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 mt-2">
                                <button onClick={() => setReplyingTo(comment.id)} className="text-[11px] text-[#555] hover:text-white transition-colors">Reply</button>
                                {!comment.resolved && (
                                  <button onClick={() => { resolveComment(projectId, comment.id); toast.success("Comment resolved"); }} className="text-[11px] text-[#555] hover:text-[#22c55e] transition-colors">Resolve</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-[#6a4cf5]/10 border border-[#6a4cf5]/20 rounded-[20px] p-5">
              <h3 className="text-[14px] font-semibold text-white mb-1">Ready to approve?</h3>
              <p className="text-[12px] text-[#999] mb-4">Review all sections and approve the project scope to move forward.</p>
              <Link href={`/projects/${projectId}/approval`}>
                <Button variant="primary" size="sm" className="w-full gap-2">
                  <CheckCircle size={13} /> Go to approval
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal open={commentModal} onClose={() => setCommentModal(false)} title="Leave feedback" size="sm">
        <div className="space-y-4">
          {selectedNode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1c1c1c] rounded-[8px]">
              <span className="text-[12px] text-[#555]">On:</span>
              <span className="text-[12px] text-white font-medium">{selectedNode.data.label}</span>
            </div>
          )}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Describe your feedback or question..."
            rows={4}
            className="w-full bg-[#1c1c1c] border border-[#262626] rounded-[10px] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#0099ff]/50 resize-none"
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setCommentModal(false)}>Cancel</Button>
            <Button variant="primary" size="md" className="flex-1 gap-2" onClick={handleAddComment} disabled={!commentText.trim()}>
              <Send size={13} /> Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
