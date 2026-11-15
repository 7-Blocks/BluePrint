"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  ReactFlow, Background, MiniMap, Controls, BackgroundVariant,
  addEdge, applyNodeChanges, applyEdgeChanges,
  type Node, type Edge, type Connection, type NodeChange, type EdgeChange,
  useReactFlow, ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAppStore } from "@/store";
import { NODE_TYPES } from "@/components/editor/nodes/canvas-nodes";
import { LeftPanel } from "@/components/editor/panels/left-panel";
import { RightPanel } from "@/components/editor/panels/right-panel";
import { EditorToolbar } from "@/components/editor/toolbar/editor-toolbar";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { CanvasNode, CanvasEdge, NodeType } from "@/types";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

function toFlowNodes(nodes: CanvasNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data as Record<string, unknown>,
  }));
}

function toFlowEdges(edges: CanvasEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    style: { stroke: "#262626", strokeWidth: 1.5 },
    labelStyle: { fill: "#555", fontSize: 11 },
  }));
}

function fromFlowNode(n: Node): CanvasNode {
  return {
    id: n.id,
    type: n.type as NodeType,
    position: n.position,
    data: n.data as CanvasNode["data"],
  };
}

function fromFlowEdge(e: Edge): CanvasEdge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: typeof e.label === "string" ? e.label : undefined,
  };
}

function EditorCanvas() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { projects, updateProject, selectedNodeId, setSelectedNode, saveStatus, setSaveStatus, undoStack, redoStack, pushUndo, undo, redo, initAuth, loadProjects } = useAppStore();
  const project = projects.find((p) => p.id === projectId);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [shareModal, setShareModal] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    initAuth();
    loadProjects();
  }, []);

  useEffect(() => {
    if (project) {
      setNodes(toFlowNodes(project.nodes));
      setEdges(toFlowEdges(project.edges));
    }
  }, [project?.id]);

  const scheduleSave = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setSaveStatus("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      updateProject(projectId, {
        nodes: newNodes.map(fromFlowNode),
        edges: newEdges.map(fromFlowEdge),
      });
      setTimeout(() => setSaveStatus("saved"), 300);
    }, 800);
  }, [projectId, updateProject, setSaveStatus]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);
      scheduleSave(updated, edges);
      return updated;
    });
  }, [edges, scheduleSave]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const updated = applyEdgeChanges(changes, eds);
      scheduleSave(nodes, updated);
      return updated;
    });
  }, [nodes, scheduleSave]);

  const onConnect = useCallback((connection: Connection) => {
    pushUndo(nodes.map(fromFlowNode), edges.map(fromFlowEdge));
    setEdges((eds) => {
      const updated = addEdge({ ...connection, id: `e-${generateId()}`, style: { stroke: "#262626", strokeWidth: 1.5 } }, eds);
      scheduleSave(nodes, updated);
      return updated;
    });
  }, [nodes, edges, pushUndo, scheduleSave]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setFirstVisit(false);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleAddNode = useCallback((type: NodeType, label: string, desc: string) => {
    pushUndo(nodes.map(fromFlowNode), edges.map(fromFlowEdge));
    const newNode: Node = {
      id: `${type}-${generateId()}`,
      type,
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: { label, description: desc } as Record<string, unknown>,
    };
    setNodes((nds) => {
      const updated = [...nds, newNode];
      scheduleSave(updated, edges);
      return updated;
    });
    setSelectedNode(newNode.id);
    toast.success(`Added ${label}`);
  }, [nodes, edges, pushUndo, scheduleSave, setSelectedNode]);

  const handleUpdateNode = useCallback((id: string, data: Partial<CanvasNode["data"]>) => {
    setNodes((nds) => {
      const updated = nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } as Record<string, unknown> } : n);
      scheduleSave(updated, edges);
      return updated;
    });
  }, [edges, scheduleSave]);

  const handleDeleteNode = useCallback((id: string) => {
    pushUndo(nodes.map(fromFlowNode), edges.map(fromFlowEdge));
    setNodes((nds) => {
      const updated = nds.filter((n) => n.id !== id);
      const updatedEdges = edges.filter((e) => e.source !== id && e.target !== id);
      scheduleSave(updated, updatedEdges);
      setEdges(updatedEdges);
      return updated;
    });
    setSelectedNode(null);
    toast.success("Block deleted");
  }, [nodes, edges, pushUndo, scheduleSave, setSelectedNode]);

  const handleUndo = useCallback(() => {
    undo(projectId);
    const p = useAppStore.getState().projects.find((p) => p.id === projectId);
    if (p) { setNodes(toFlowNodes(p.nodes)); setEdges(toFlowEdges(p.edges)); }
  }, [undo, projectId]);

  const handleRedo = useCallback(() => {
    redo(projectId);
    const p = useAppStore.getState().projects.find((p) => p.id === projectId);
    if (p) { setNodes(toFlowNodes(p.nodes)); setEdges(toFlowEdges(p.edges)); }
  }, [redo, projectId]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedCanvasNode: CanvasNode | null = selectedNode ? fromFlowNode(selectedNode) : null;

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#555]">Project not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#090909] overflow-hidden">
      <EditorToolbar
        projectId={projectId}
        projectName={project.name}
        saveStatus={saveStatus}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={() => zoomIn({ duration: 200 })}
        onZoomOut={() => zoomOut({ duration: 200 })}
        onFitView={() => fitView({ padding: 0.1 })}
        onShare={() => setShareModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel onAddNode={handleAddNode} />

        <div className="flex-1 relative">
          {firstVisit && nodes.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#141414] border border-[#262626] rounded-full px-4 py-2 pointer-events-none">
              <span className="text-[12px] text-[#999]">Click a block to select · Drag to move · Connect handles to link</span>
            </div>
          )}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[15px] font-medium text-[#333] mb-2">Canvas is empty</p>
                <p className="text-[13px] text-[#262626]">Add blocks from the left panel to get started</p>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.1}
            maxZoom={2}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
            style={{ background: "#090909" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1a1a1a" />
            <MiniMap
              nodeColor={(n) => {
                const colors: Record<string, string> = { page: "#6a4cf5", feature: "#0099ff", "user-role": "#22c55e", integration: "#ff7a3d", workflow: "#d44df0" };
                return colors[n.type || "page"] || "#555";
              }}
              maskColor="rgba(9,9,9,0.7)"
            />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        <RightPanel
          node={selectedCanvasNode}
          onUpdate={handleUpdateNode}
          onDelete={handleDeleteNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      <Modal open={shareModal} onClose={() => setShareModal(false)} title="Share project" size="sm">
        <div className="space-y-4">
          <p className="text-[14px] text-[#999]">Share this link with your client to let them review the project.</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/share/${project.shareId}`}
              className="flex-1 bg-[#1c1c1c] border border-[#262626] rounded-[10px] px-3 py-2 text-[13px] text-[#999] font-mono"
            />
            <Button variant="primary" size="sm" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/share/${project.shareId}`);
              toast.success("Link copied!");
            }}>
              Copy
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => setShareModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorCanvas />
    </ReactFlowProvider>
  );
}
