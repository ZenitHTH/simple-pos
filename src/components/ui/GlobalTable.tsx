"use client";

import { ReactNode } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { cn } from "@/lib";

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
              <td
                colSpan={columns.length}
                className="text-muted-foreground/60 px-6 py-16 text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <FaBoxOpen className="text-muted-foreground/20 text-5xl" />
                  <span className="text-sm font-medium">{emptyMessage}</span>
                </div>
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
