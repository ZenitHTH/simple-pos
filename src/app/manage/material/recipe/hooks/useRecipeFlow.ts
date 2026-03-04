import { useState, useCallback, useEffect } from "react";
import {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  OnConnect,
  Connection,
  XYPosition,
} from "@xyflow/react";
import {
  BackendProduct,
  Material,
  recipeApi,
  productApi,
  materialApi,
  AppSettings,
} from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";
import { logger } from "@/lib/logger";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function useRecipeFlow({ onSaved }: { onSaved?: () => void } = {}) {
  const { dbKey } = useDatabase();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (dbKey) {
      loadData();
    }
  }, [dbKey]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!dbKey) throw new Error("Database key not found");

      // Fetch products
      const pData = await productApi.getAll(dbKey);
      setProducts(pData);

      // Fetch materials
      const mData = await materialApi.getAll(dbKey);
      setMaterials(mData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      // Ensure we are connecting Material (source) to Product (target)
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (sourceNode?.type !== "material" || targetNode?.type !== "product") {
        setError("You must connect a Material to a Product.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "volumeEdge",
            data: { volume_use: 1, unit: "Pieces" },
          },
          eds,
        ),
      );
    },
    [setEdges, nodes],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (
      event: React.DragEvent,
      screenToFlowPosition: (p: XYPosition) => XYPosition,
    ) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const dataStr = event.dataTransfer.getData("application/reactflow-data");

      if (typeof type === "undefined" || !type || !dataStr) {
        return;
      }

      const parsedData = JSON.parse(dataStr);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Prevent duplicate product nodes on canvas for simplicity right now
      // Or just allow and they can build multiple recipes at once
      if (
        type === "product" &&
        nodes.some((n) => n.type === "product" && n.data.id === parsedData.id)
      ) {
        setError(`${parsedData.label} is already on the canvas.`);
        setTimeout(() => setError(null), 3000);
        return;
      }

      const newNode: Node = {
        id: `${type}-${parsedData.id}-${Date.now()}`,
        type,
        position,
        data: parsedData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  const saveRecipes = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);
      if (!dbKey) throw new Error("Database key not found");

      // Find all products on the canvas
      const productNodes = nodes.filter((n) => n.type === "product");
      if (productNodes.length === 0) {
        throw new Error("No products on the canvas to save recipes for.");
      }

      // For each product, find connected materials and save
      for (const pNode of productNodes) {
        const productId = pNode.data.id as number;

        // Find edges targeting this product
        const incomingEdges = edges.filter((e) => e.target === pNode.id);

        if (incomingEdges.length === 0) {
          continue; // Skip products with no materials linked
        }

        // 1. Delete existing recipe list if any, and create new
        const existingList = await recipeApi.getListByProduct(dbKey, productId);
        if (existingList) {
          await recipeApi.deleteList(dbKey, existingList.id);
        }

        const newList = await recipeApi.createList(dbKey, productId);

        // 2. Add recipe items from incoming edges
        for (const edge of incomingEdges) {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          if (sourceNode && sourceNode.type === "material") {
            const materialId = sourceNode.data.id as number;
            const volumeUse = (edge.data?.volume_use as number) || 1;
            const unit = (edge.data?.unit as string) || "Pieces";
            await recipeApi.addItem(
              dbKey,
              newList.id,
              materialId,
              volumeUse,
              unit,
            );
          }
        }
      }

      setSuccessMsg("Recipes saved successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      onSaved?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save recipes");
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  const loadRecipeForProduct = async (
    productNodeId: string,
    productId: number,
  ) => {
    // Optionally load existing recipe from DB onto canvas
    try {
      if (!dbKey) return;

      const list = await recipeApi.getListByProduct(dbKey, productId);
      if (!list) return;

      const items = await recipeApi.getItems(dbKey, list.id);

      // Get product node position
      const pNode = nodes.find((n) => n.id === productNodeId);
      if (!pNode) return;

      let newNodes: Node[] = [];
      let newEdges: Edge[] = [];

      items.forEach((item, index) => {
        const material = materials.find((m) => m.id === item.material_id);
        if (!material) return;

        const mNodeId = `material-${material.id}-${Date.now()}-${index}`;
        newNodes.push({
          id: mNodeId,
          type: "material",
          position: {
            x: pNode.position.x - 250,
            y: pNode.position.y + index * 80,
          },
          data: {
            id: material.id,
            label: material.name,
            type_: material.type_,
            quantity: material.quantity,
          },
        });

        newEdges.push({
          id: `edge-${mNodeId}-${pNode.id}`,
          source: mNodeId,
          target: pNode.id,
          type: "volumeEdge",
          data: { volume_use: item.volume_use, unit: item.unit },
        });
      });

      if (newNodes.length > 0) {
        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
      }
    } catch (err) {
      logger.error("Failed to load recipe items:", err);
    }
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    products,
    materials,
    loading,
    saving,
    error,
    successMsg,
    saveRecipes,
    clearCanvas,
    loadRecipeForProduct,
  };
}
