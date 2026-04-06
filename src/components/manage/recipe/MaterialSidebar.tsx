"use client";

import { Material } from "@/lib";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { useState } from "react";

interface MaterialSidebarProps {
  materials: Material[];
  onDragStart: (
    event: React.DragEvent,
    nodeType: string,
    nodeData: any,
  ) => void;
}

export default function MaterialSidebar({
  materials,
  onDragStart,
}: MaterialSidebarProps) {
  const [materialSearch, setMaterialSearch] = useState("");

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(materialSearch.toLowerCase()),
  );

  return (
    <aside className="bg-muted/30 border-border flex h-full w-64 flex-col border-r p-4 shadow-inner">
      <h3 className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
        <FaBoxes className="text-primary" /> Materials
      </h3>

      <div className="relative mb-4 shrink-0">
        <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-2 -translate-y-1/2 text-xs" />
        <input
          type="text"
          placeholder="Search materials..."
          value={materialSearch}
          onChange={(e) => setMaterialSearch(e.target.value)}
          className="border-border bg-background focus:ring-primary/50 w-full rounded-lg border py-2 pr-2 pl-8 text-xs transition-all outline-none focus:ring-2"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredMaterials.map((material) => (
          <div
            key={`m-${material.id}`}
            className="bg-card border-border hover:border-primary/50 hover:bg-muted/50 group flex cursor-grab items-center gap-3 overflow-hidden rounded-xl border p-3 text-sm shadow-sm transition-all active:cursor-grabbing"
            onDragStart={(event) =>
              onDragStart(event, "material", {
                id: material.id,
                label: material.name,
                type_: material.type_,
                quantity: material.quantity,
              })
            }
            draggable
          >
            <div className="bg-primary/10 text-primary group-hover:bg-primary rounded-lg p-2 transition-colors group-hover:text-white">
              <FaBoxes className="shrink-0" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate leading-tight font-medium">
                {material.name}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {material.quantity} {material.type_}
              </span>
            </div>
          </div>
        ))}
        {filteredMaterials.length === 0 && (
          <div className="text-muted-foreground py-8 text-center text-xs italic">
            No materials found
          </div>
        )}
      </div>
    </aside>
  );
}
