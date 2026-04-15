import { FaEdit, FaTrash } from "react-icons/fa";
import { Material, formatVolume } from "@/lib";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableActionButton } from "@/components/ui/TableActionButton";

interface MaterialTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: number) => void;
}

/**
 * MaterialTable component displays a list of materials in a tabular format.
 * It shows details like ID, name, type, tags, volume, and quantity, with edit/delete actions.
 * 
 * @param {MaterialTableProps} props - The component props.
 * @param {Material[]} props.materials - List of materials to display.
 * @param {(material: Material) => void} props.onEdit - Callback when the edit button is clicked.
 * @param {(id: number) => void} props.onDelete - Callback when the delete button is clicked.
 */
export default function MaterialTable({
  materials,
  onEdit,
  onDelete,
}: MaterialTableProps) {
  if (materials.length === 0) {
    return (
      <EmptyState
        message="No materials found. Add some materials to get started."
        className="h-64 border border-dashed rounded-xl"
      />
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
                  <Badge variant="secondary" className="rounded-full">
                    {m.type_}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {m.tags && m.tags.length > 0 ? (
                      m.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="primary-subtle"
                          className="rounded-full text-[10px] uppercase tracking-wider"
                        >
                          {tag}
                        </Badge>
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
                    <TableActionButton
                      onClick={() => onEdit(m)}
                      title="Edit material"
                      icon={<FaEdit size={16} />}
                    />
                    <TableActionButton
                      onClick={() => onDelete(m.id)}
                      title="Delete material"
                      variant="destructive"
                      icon={<FaTrash size={16} />}
                    />
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
