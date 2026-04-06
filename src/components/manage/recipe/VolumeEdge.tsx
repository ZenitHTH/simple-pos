import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from "@xyflow/react";

const UNIT_OPTIONS = [
  "Pieces",
  "Grams",
  "Kilograms",
  "Milliliters",
  "Liters",
  "Box",
  "Pack",
];

export default function VolumeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onVolumeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              volume_use: parseFloat(evt.target.value) || 0,
            },
          };
        }
        return edge;
      }),
    );
  };

  const onUnitChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              unit: evt.target.value,
            },
          };
        }
        return edge;
      }),
    );
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-primary"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            cursor: "pointer",
            pointerEvents: "all",
          }}
          className="nodrag nopan bg-card text-foreground border-border flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs shadow-md"
        >
          <span className="text-muted-foreground text-[10px] font-semibold uppercase">
            Qty
          </span>
          <input
            id={`vol-${id}`}
            type="number"
            min="0"
            step="any"
            className="bg-muted h-6 w-14 rounded px-1 text-center outline-none"
            value={(data?.volume_use as number) || 1}
            onChange={onVolumeChange}
          />
          <select
            id={`unit-${id}`}
            className="bg-muted text-foreground h-6 cursor-pointer rounded px-1 text-[11px] outline-none"
            value={(data?.unit as string) || "Pieces"}
            onChange={onUnitChange}
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
