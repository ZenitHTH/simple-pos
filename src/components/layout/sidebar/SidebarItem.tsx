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
      className={cn(
        "group tuner-sidebar-item flex items-center gap-3 transition-[background-color,color,box-shadow,transform] duration-200",
        isSubItem ? "px-3 py-2 text-[0.9em]" : "px-4 py-3",
        isActive
          ? "bg-primary text-primary-foreground shadow-primary-glow shadow-md"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "tuner-sidebar-icon flex items-center justify-center shrink-0",
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
