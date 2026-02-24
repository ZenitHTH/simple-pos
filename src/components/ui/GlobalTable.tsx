"use client";

import { ReactNode } from "react";

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
}

export default function GlobalTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "No items found",
}: GlobalTableProps<T>) {
  return (
    <div className="bg-card text-card-foreground border-border overflow-hidden rounded-xl border shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-muted/50 border-border border-b">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`text-muted-foreground px-6 py-3 font-medium ${col.headerClassName || ""}`}
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
                className="text-muted-foreground px-6 py-12 text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={String(item[keyField])}
                className="hover:bg-muted/50 transition-colors"
              >
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className={`px-6 py-5 ${col.className || ""}`}
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
