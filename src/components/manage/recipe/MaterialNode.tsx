import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { FaBoxes } from "react-icons/fa";

type MaterialNodeData = {
  label: string;
  type_: string;
  quantity: number;
};
export type MaterialNodeType = Node<MaterialNodeData, "material">;

export default function MaterialNode({ data }: NodeProps<MaterialNodeType>) {
  return (
    <div className="bg-card border-border w-40 overflow-hidden rounded-lg border shadow-md">
      <div className="bg-muted border-border flex items-center gap-2 border-b p-2">
        <FaBoxes className="text-muted-foreground" />
        <span className="truncate text-sm font-semibold">{data.label}</span>
      </div>
      <div className="text-muted-foreground bg-card flex items-center justify-between p-2 text-xs">
        <span>Stock: {data.quantity}</span>
        <span className="bg-secondary rounded-full px-2 py-0.5">
          {data.type_}
        </span>
      </div>
      {/* Source handle on the right to start edges */}
      <Handle
        type="source"
        position={Position.Right}
        className="bg-secondary-foreground h-3 w-3"
      />
    </div>
  );
}
