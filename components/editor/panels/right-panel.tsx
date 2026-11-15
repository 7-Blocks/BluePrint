"use client";
import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import type { CanvasNode, NodeType, Priority } from "@/types";
import { NodeTypeBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  node: CanvasNode | null;
  onUpdate: (id: string, data: Partial<CanvasNode["data"]>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];

export function RightPanel({ node, onUpdate, onDelete, onClose }: RightPanelProps) {
  const [data, setData] = useState<Record<string, unknown>>(node?.data || {});

  useEffect(() => {
    setData((node?.data || {}) as Record<string, unknown>);
  }, [node?.id]);

  if (!node) {
    return (
      <div className="w-64 flex-shrink-0 bg-[#0f0f0f] border-l border-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-[10px] bg-[#141414] border border-[#262626] flex items-center justify-center mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#333" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="#333" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="#333" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="#333" opacity="0.4" />
          </svg>
        </div>
        <p className="text-[13px] font-medium text-[#555] mb-1">No block selected</p>
        <p className="text-[11px] text-[#333] leading-relaxed">Click any block on the canvas to view and edit its properties.</p>
      </div>
    );
  }

  const set = (k: string, v: string | string[]) => {
    const updated = { ...data, [k]: v };
    setData(updated);
    onUpdate(node.id, updated as Partial<CanvasNode["data"]>);
  };

  const d = data as Record<string, unknown>;

  return (
    <div className="w-64 flex-shrink-0 bg-[#0f0f0f] border-l border-[#1a1a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <NodeTypeBadge type={node.type} />
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full text-[#555] hover:text-white hover:bg-[#1c1c1c] transition-colors">
          <X size={13} />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Field label="Name" value={(d.label as string) || ""} onChange={(v) => set("label", v)} />
        <FieldArea label="Description" value={(d.description as string) || ""} onChange={(v) => set("description", v)} />

        {node.type === "page" && (
          <>
            <Field label="URL Path" value={(d.path as string) || ""} onChange={(v) => set("path", v)} placeholder="/page-name" />
            <FieldArea label="User Access" value={((d.userAccess as string[]) || []).join(", ")} onChange={(v) => set("userAccess", v.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Student, Instructor" hint="Comma-separated roles" />
          </>
        )}

        {node.type === "feature" && (
          <>
            <div>
              <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-2">Priority</p>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map((p) => (
                  <button key={p} onClick={() => set("priority", p)}
                    className={cn("px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border",
                      (d.priority as string) === p ? "bg-[#1c1c1c] border-[#0099ff]/40 text-white" : "bg-transparent border-[#262626] text-[#555] hover:text-white")}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <FieldArea label="Dependencies" value={((d.dependencies as string[]) || []).join(", ")} onChange={(v) => set("dependencies", v.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Authentication, Payments" hint="Comma-separated features" />
          </>
        )}

        {node.type === "workflow" && (
          <>
            <Field label="Trigger" value={(d.trigger as string) || ""} onChange={(v) => set("trigger", v)} placeholder="What starts this workflow?" />
            <FieldArea label="Steps" value={((d.steps as string[]) || []).join("\n")} onChange={(v) => set("steps", v.split("\n").filter(Boolean))} placeholder="One step per line" rows={5} hint="One step per line" />
            <Field label="Expected Outcome" value={(d.outcome as string) || ""} onChange={(v) => set("outcome", v)} placeholder="What happens at the end?" />
          </>
        )}

        <FieldArea label="Notes" value={(d.notes as string) || ""} onChange={(v) => set("notes", v)} placeholder="Additional notes..." />
      </div>

      {/* Delete */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <Button variant="danger" size="sm" className="w-full gap-2" onClick={() => onDelete(node.id)}>
          <Trash2 size={13} /> Delete block
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#141414] border border-[#262626] rounded-[8px] px-3 py-2 text-[13px] text-white placeholder:text-[#333] focus:outline-none focus:border-[#0099ff]/50 transition-colors"
      />
      {hint && <p className="text-[10px] text-[#333] mt-1">{hint}</p>}
    </div>
  );
}

function FieldArea({ label, value, onChange, placeholder, hint, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-[#555] uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[#141414] border border-[#262626] rounded-[8px] px-3 py-2 text-[13px] text-white placeholder:text-[#333] focus:outline-none focus:border-[#0099ff]/50 transition-colors resize-none"
      />
      {hint && <p className="text-[10px] text-[#333] mt-1">{hint}</p>}
    </div>
  );
}
