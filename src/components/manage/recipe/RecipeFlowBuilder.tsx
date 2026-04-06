import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Panel,
} from "@xyflow/react";
import { useRecipeFlow } from "@/app/manage/material/recipe/hooks/useRecipeFlow";
import MaterialSidebar from "./MaterialSidebar";
import ProductSidebar from "./ProductSidebar";
import ProductNode from "./ProductNode";
import MaterialNode from "./MaterialNode";
import VolumeEdge from "./VolumeEdge";

const nodeTypes = {
  product: ProductNode,
  material: MaterialNode,
};

const edgeTypes = {
  volumeEdge: VolumeEdge,
};

export default function RecipeFlowBuilder({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    products,
    materials,
    saving,
    error,
    successMsg,
    saveRecipes,
    clearCanvas,
  } = useRecipeFlow({ onSaved });

  const handleDragStart = (
    event: React.DragEvent,
    nodeType: string,
    nodeData: any,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData(
      "application/reactflow-data",
      JSON.stringify(nodeData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = useCallback(
    (event: React.DragEvent) => onDrop(event, screenToFlowPosition),
    [onDrop, screenToFlowPosition],
  );

  return (
    <div
      className="bg-background relative flex h-full w-full"
      ref={reactFlowWrapper}
    >
      <MaterialSidebar materials={materials} onDragStart={handleDragStart} />

      <div className="relative h-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={handleDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-muted/5 font-sans"
        >
          <Background
            color="var(--muted-foreground)"
            gap={20}
            size={1.5}
            className="opacity-15"
          />
          <Controls className="bg-card! text-foreground border-border! fill-foreground [&_button]:border-border! [&_button]:bg-card! [&_button]:text-foreground! [&_button:hover]:bg-muted! [&_path]:fill-foreground! overflow-hidden rounded-lg shadow-md" />
          <MiniMap
            zoomable
            pannable
            nodeClassName="bg-primary/20!"
            className="bg-card! border-border! rounded-xl border shadow-lg"
            maskColor="color-mix(in srgb, var(--muted) 80%, transparent)"
          />

          <Panel position="top-right" className="flex gap-2">
            <button
              onClick={clearCanvas}
              type="button"
              className="bg-card border-border hover:bg-muted text-foreground flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold tracking-wider uppercase shadow-sm transition-all active:scale-95"
            >
              Clear Canvas
            </button>
            <button
              onClick={saveRecipes}
              disabled={saving}
              type="button"
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                  Saving...
                </>
              ) : (
                "Save Recipes"
              )}
            </button>
          </Panel>

          {(error || successMsg) && (
            <Panel position="top-center" className="z-50 min-w-80">
              {error && (
                <div className="border-destructive/20 bg-destructive/10 text-destructive animate-in slide-in-from-top-4 flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold shadow-2xl backdrop-blur-md">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="border-success/20 bg-success/10 text-success animate-in slide-in-from-top-4 flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold shadow-2xl backdrop-blur-md">
                  {successMsg}
                </div>
              )}
            </Panel>
          )}
        </ReactFlow>
      </div>

      <ProductSidebar products={products} onDragStart={handleDragStart} />
    </div>
  );
}
