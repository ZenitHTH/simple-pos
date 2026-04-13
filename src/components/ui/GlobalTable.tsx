"use client";

import { ReactNode } from "react";
import { cn } from "@/lib";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Definition for a table column in GlobalTable.
 */
export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface GlobalTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
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
        "bg-card text-card-foreground border-border overflow-hidden rounded-2xl border shadow-sm",
        className,
      )}
    >
      <table className="w-full text-left">
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
