import { ReactNode } from "react";

/**
 * Definition for a table column in GlobalTable.
 * @template T - The type of data being displayed in the table.
 */
export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

/**
 * Represents an option in a Select component.
 */
export interface SelectOption {
  /** The value of the option. */
  value: string | number;
  /** The human-readable label for the option. */
  label: string;
}

/** Supported types of toast notifications. */
export type ToastType = "success" | "error" | "info";

/** Tabs available in the Design Tuner sidebar. */
export type TunerTab =
  | "global"
  | "selector"
  | "button"
  | "typography"
  | "cart"
  | "grid"
  | "sidebar"
  | "history"
  | "numpad";
