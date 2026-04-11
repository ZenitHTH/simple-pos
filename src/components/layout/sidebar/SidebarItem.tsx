"use client";

import Link from "next/link";
import { cn } from "@/lib";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
  isSubItem?: boolean;
}

export function SidebarItem({
  name,
  path,
  icon,
  isActive,
  isSubItem = false,
}: SidebarItemProps) {
  return (
    <Link
      href={path}
      style={{
        padding: isSubItem 
          ? `calc(0.625rem * var(--sidebar-button-scale, 1)) calc(0.75rem * var(--sidebar-button-scale, 1))` 
          : `calc(0.75rem * var(--sidebar-button-scale, 1)) calc(1rem * var(--sidebar-button-scale, 1))`
      }}
      className={cn(
        "group flex items-center gap-3 transition-all duration-200",
        isSubItem
          ? "rounded-lg text-[0.9em]"
          : "rounded-xl",
        isActive
          ? "bg-primary text-primary-foreground shadow-primary/20 shadow-md"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span
        style={{ transform: `scale(var(--sidebar-button-scale, 1))` }}
        className={cn(
          isActive
            ? "text-primary-foreground"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {icon}
      </span>
      <span className={cn("font-medium", !isSubItem && "text-[1em]")}>
        {name}
      </span>
    </Link>
  );
}
