import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { FaBoxOpen } from "react-icons/fa";

type ProductNodeData = {
  label: string;
};
export type ProductNodeType = Node<ProductNodeData, "product">;

export default function ProductNode({ data }: NodeProps<ProductNodeType>) {
  return (
    <div className="bg-card border-primary w-48 overflow-hidden rounded-lg border-2 shadow-lg">
      <div className="bg-primary/10 border-primary/20 flex items-center gap-2 border-b p-2">
        <FaBoxOpen className="text-primary" />
        <span className="truncate text-sm font-bold">{data.label}</span>
      </div>
      <div className="bg-card text-muted-foreground flex h-full items-center justify-between p-3 text-xs">
        <span>Connect materials to craft this product.</span>
      </div>
      {/* Target handle on the left to receive edges */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-primary h-3 w-3"
      />
    </div>
  );
}
