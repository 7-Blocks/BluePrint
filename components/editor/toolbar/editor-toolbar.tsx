"use client";
import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Eye, Share2, CheckCircle, Save, AlertCircle, Loader2, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";


interface ToolbarProps {
  projectId: string;
  projectName: string;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onShare: () => void;
}

const SAVE_ICONS = {
  saved: <CheckCircle size={13} className="text-[#22c55e]" />,
  saving: <Loader2 size={13} className="text-[#0099ff] animate-spin" />,
  unsaved: <Save size={13} className="text-[#ff7a3d]" />,
  error: <AlertCircle size={13} className="text-red-400" />,
};

const SAVE_LABELS = {
  saved: "Saved",
  saving: "Saving...",
  unsaved: "Unsaved changes",
  error: "Save failed",
};

export function EditorToolbar({
  projectId, projectName, saveStatus, canUndo, canRedo,
  onUndo, onRedo, onZoomIn, onZoomOut, onFitView, onShare,
}: ToolbarProps) {
  return (
    <div className="h-12 bg-[#0f0f0f] border-b border-[#1a1a1a] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Back + breadcrumb */}
      <Link href="/projects" className="flex items-center gap-1.5 text-[#555] hover:text-white transition-colors mr-1">
        <ArrowLeft size={14} />
      </Link>
      <div className="flex items-center gap-1.5 text-[13px]">
        <Link href="/projects" className="text-[#555] hover:text-white transition-colors">Projects</Link>
        <span className="text-[#333]">/</span>
        <span className="text-white font-medium truncate max-w-[160px]">{projectName}</span>
      </div>

      <div className="w-px h-5 bg-[#1a1a1a] mx-1" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <Tooltip content="Undo (Ctrl+Z)">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#555] hover:text-white hover:bg-[#141414] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Y)">
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#555] hover:text-white hover:bg-[#141414] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Redo2 size={14} />
          </button>
        </Tooltip>
      </div>

      <div className="w-px h-5 bg-[#1a1a1a] mx-1" />

      {/* Zoom */}
      <div className="flex items-center gap-0.5">
        <Tooltip content="Zoom in">
          <button onClick={onZoomIn} className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#555] hover:text-white hover:bg-[#141414] transition-colors">
            <ZoomIn size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Zoom out">
          <button onClick={onZoomOut} className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#555] hover:text-white hover:bg-[#141414] transition-colors">
            <ZoomOut size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Fit to screen">
          <button onClick={onFitView} className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#555] hover:text-white hover:bg-[#141414] transition-colors">
            <Maximize2 size={14} />
          </button>
        </Tooltip>
      </div>

      <div className="flex-1" />

      {/* Save status */}
      <div className="flex items-center gap-1.5">
        {SAVE_ICONS[saveStatus]}
        <span className="text-[12px] text-[#555]">{SAVE_LABELS[saveStatus]}</span>
      </div>

      <div className="w-px h-5 bg-[#1a1a1a] mx-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/projects/${projectId}/review`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Eye size={13} /> Preview
          </Button>
        </Link>
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={onShare}>
          <Share2 size={13} /> Share
        </Button>
        <Link href={`/projects/${projectId}/approval`}>
          <Button variant="primary" size="sm" className="gap-1.5">
            <CheckCircle size={13} /> Finalize
          </Button>
        </Link>
      </div>
    </div>
  );
}
