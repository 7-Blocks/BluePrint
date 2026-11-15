"use client";
import { useState } from "react";

const DEMO_NODES = [
  { id: "home", label: "Home", type: "page", x: 160, y: 20, desc: "Main landing page with featured courses" },
  { id: "login", label: "Login", type: "page", x: 40, y: 120, desc: "User authentication" },
  { id: "courses", label: "Courses", type: "page", x: 280, y: 120, desc: "Browse all available courses" },
  { id: "auth", label: "Authentication", type: "feature", x: 40, y: 220, desc: "Email & social login system" },
  { id: "search", label: "Search", type: "feature", x: 280, y: 220, desc: "Full-text course search" },
  { id: "student", label: "Student", type: "user-role", x: 160, y: 320, desc: "Primary learner persona" },
];

const DEMO_EDGES = [
  { from: "home", to: "login" }, { from: "home", to: "courses" },
  { from: "login", to: "auth" }, { from: "courses", to: "search" },
  { from: "student", to: "home" },
];

const TYPE_COLORS: Record<string, string> = {
  page: "#6a4cf5",
  feature: "#0099ff",
  "user-role": "#22c55e",
};

function getCenter(id: string) {
  const n = DEMO_NODES.find((n) => n.id === id);
  if (!n) return { x: 0, y: 0 };
  return { x: n.x + 70, y: n.y + 18 };
}

export function InteractiveDemo() {
  const [selected, setSelected] = useState<string | null>("home");

  const selectedNode = DEMO_NODES.find((n) => n.id === selected);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Canvas */}
      <div className="relative w-full lg:w-[440px] h-[380px] rounded-[20px] bg-[#141414] border border-[#262626] overflow-hidden flex-shrink-0"
        style={{ backgroundImage: "radial-gradient(circle, #1c1c1c 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {DEMO_EDGES.map((e, i) => {
            const from = getCenter(e.from);
            const to = getCenter(e.to);
            const isActive = selected === e.from || selected === e.to;
            return (
              <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isActive ? "#0099ff" : "#262626"}
                strokeWidth={isActive ? 1.5 : 1}
                strokeDasharray={isActive ? "none" : "4 3"}
                style={{ transition: "stroke 0.2s" }}
              />
            );
          })}
        </svg>

        {DEMO_NODES.map((node) => {
          const color = TYPE_COLORS[node.type];
          const isSelected = selected === node.id;
          return (
            <button
              key={node.id}
              className="absolute flex items-center gap-2 px-3 py-2 rounded-[10px] border transition-all duration-150 cursor-pointer"
              style={{
                left: node.x, top: node.y,
                background: isSelected ? "#1c1c1c" : "#141414",
                borderColor: isSelected ? color : "#262626",
                boxShadow: isSelected ? `0 0 0 1px ${color}40, 0 4px 12px ${color}20` : "none",
              }}
              onClick={() => setSelected(node.id)}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-[13px] font-medium text-white whitespace-nowrap">{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Info panel */}
      <div className="flex-1 min-h-[200px]">
        {selectedNode ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[selectedNode.type] }} />
              <span className="text-[12px] font-medium uppercase tracking-wider" style={{ color: TYPE_COLORS[selectedNode.type] }}>
                {selectedNode.type.replace("-", " ")}
              </span>
            </div>
            <h3 className="text-[24px] font-semibold text-white tracking-tight mb-2">{selectedNode.label}</h3>
            <p className="text-[15px] text-[#999] leading-relaxed mb-4">{selectedNode.desc}</p>
            <div className="text-[13px] text-[#555]">
              Connected to:{" "}
              {DEMO_EDGES
                .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                .map((e) => {
                  const otherId = e.from === selectedNode.id ? e.to : e.from;
                  return DEMO_NODES.find((n) => n.id === otherId)?.label;
                })
                .filter(Boolean)
                .join(", ") || "No connections"}
            </div>
          </div>
        ) : (
          <p className="text-[15px] text-[#555]">Click any block to explore</p>
        )}
      </div>
    </div>
  );
}
