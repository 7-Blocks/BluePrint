"use client";
import { useState } from "react";
import { FileText, Zap, Users, ArrowRight, MessageSquare } from "lucide-react";

const PREVIEW_NODES = [
  { id: "n1", label: "Home", type: "page", x: 40, y: 60, color: "#6a4cf5" },
  { id: "n2", label: "Login", type: "page", x: 200, y: 30, color: "#6a4cf5" },
  { id: "n3", label: "Courses", type: "page", x: 200, y: 100, color: "#6a4cf5" },
  { id: "n4", label: "Auth", type: "feature", x: 360, y: 30, color: "#0099ff" },
  { id: "n5", label: "Payments", type: "feature", x: 360, y: 100, color: "#0099ff" },
  { id: "n6", label: "Student", type: "user-role", x: 40, y: 160, color: "#22c55e" },
];

const PREVIEW_EDGES = [
  { from: "n1", to: "n2" }, { from: "n1", to: "n3" },
  { from: "n2", to: "n4" }, { from: "n3", to: "n5" },
  { from: "n6", to: "n1" },
];

function getNodeCenter(id: string) {
  const n = PREVIEW_NODES.find((n) => n.id === id);
  if (!n) return { x: 0, y: 0 };
  return { x: n.x + 52, y: n.y + 16 };
}

export function HeroPreview() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[680px] mx-auto rounded-[20px] bg-[#141414] border border-[#262626] overflow-hidden shadow-2xl">
      {/* Editor toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] bg-[#0f0f0f]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-[12px] text-[#555] font-medium">EduFlow</span>
          <span className="text-[#333]">/</span>
          <span className="text-[12px] text-[#999]">Visual Editor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span className="text-[11px] text-[#22c55e]">Saved</span>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative h-[260px] overflow-hidden bg-[#090909]"
        style={{ backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {PREVIEW_EDGES.map((e, i) => {
            const from = getNodeCenter(e.from);
            const to = getNodeCenter(e.to);
            return (
              <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="#262626" strokeWidth="1.5" strokeDasharray="4 3" />
            );
          })}
        </svg>

        {PREVIEW_NODES.map((node) => (
          <div
            key={node.id}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-[10px] border cursor-pointer transition-all duration-150"
            style={{
              left: node.x, top: node.y,
              background: hovered === node.id ? "#1c1c1c" : "#141414",
              borderColor: hovered === node.id ? node.color + "60" : "#262626",
              boxShadow: hovered === node.id ? `0 0 0 1px ${node.color}30` : "none",
            }}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: node.color }} />
            <span className="text-[12px] font-medium text-white whitespace-nowrap">{node.label}</span>
          </div>
        ))}

        {/* Comment bubble */}
        <div className="absolute bottom-4 right-4 bg-[#141414] border border-[#262626] rounded-[10px] p-2.5 max-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-full bg-[#6a4cf5] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">S</span>
            </div>
            <span className="text-[11px] text-[#999]">Sarah Chen</span>
          </div>
          <p className="text-[11px] text-white leading-relaxed">Can we add Google login here?</p>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1a1a1a] bg-[#0f0f0f]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <FileText size={12} className="text-[#555]" />
            <span className="text-[11px] text-[#555]">9 pages</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-[#555]" />
            <span className="text-[11px] text-[#555]">7 features</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-[#555]" />
            <span className="text-[11px] text-[#555]">3 roles</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageSquare size={12} className="text-[#0099ff]" />
          <span className="text-[11px] text-[#0099ff]">3 comments</span>
        </div>
      </div>
    </div>
  );
}
