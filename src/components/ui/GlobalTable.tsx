"use client";

import { ReactNode } from "react";
import { cn } from "@/lib";
import { EmptyState } from "@/components/ui/EmptyState";
import { Column } from "@/lib/types/common";

/**
 * Props for the GlobalTable component.
 * @template T - The type of data being displayed in the table.
 */
interface GlobalTableProps<T> {
  /** Array of column definitions. */
  columns: Column<T>[];
  /** The data array to display. */
  data: T[];
  /** The field name that serves as a unique key for each row. */
  keyField: keyof T;
  /** Message to display when there is no data. Defaults to "No items found". */
  emptyMessage?: string;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * A highly reusable and configurable table component for displaying data.
 *
 * @param columns - Array of column definitions.
 * @param data - The data array to display.
 * @param keyField - The field name that serves as a unique key for each row.
 * @param emptyMessage - Message to display when there is no data.
 * @param className - Additional CSS classes.
 */
export default function GlobalTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "No items found",
  className,
}: GlobalTableProps<T>) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-border custom-scrollbar overflow-x-auto rounded-2xl border shadow-sm",
        className,
      )}
    >
      <table className="w-full min-w-[800px] text-left">
        <thead className="bg-muted/40 border-border sticky top-0 border-b">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={cn(
                  "text-muted-foreground px-6 py-3.5 text-xs font-bold tracking-wider uppercase",
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16">
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={String(item[keyField])}
                className="hover:bg-muted/30 even:bg-muted/10 transition-colors"
              >
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className={cn("px-6 py-4 text-sm", col.className)}
                  >
                    {col.render
                      ? col.render(item)
                      : col.accessor
                        ? String(item[col.accessor])
                        : ""}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
