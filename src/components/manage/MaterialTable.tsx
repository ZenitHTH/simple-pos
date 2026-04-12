import { FaEdit, FaTrash } from "react-icons/fa";
import { Material, formatVolume } from "@/lib";

interface MaterialTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: number) => void;
}

export default function MaterialTable({
  materials,
  onEdit,
  onDelete,
}: MaterialTableProps) {
  if (materials.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
        No materials found. Add some materials to get started.
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b text-xs font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4">Volume</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                <td className="text-muted-foreground px-6 py-4 font-mono">
                  #{m.id}
                </td>
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {m.type_}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {m.tags && m.tags.length > 0 ? (
                      m.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary/5 text-primary border-primary/10 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground/50 text-[10px] italic">
                        No tags
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{m.volume}</td>
                <td className="px-6 py-4 font-semibold">{m.quantity}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(m)}
                      className="text-primary hover:bg-primary/10 rounded-lg p-2 transition-colors"
                      title="Edit material"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(m.id)}
                      className="text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors"
                      title="Delete material"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
