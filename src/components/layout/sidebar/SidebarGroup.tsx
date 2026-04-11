"use client";

import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { cn } from "@/lib";
import { SidebarItem } from "./SidebarItem";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarGroupProps {
  name: string;
  icon: React.ReactNode;
  children: MenuItem[];
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
}

export function SidebarGroup({
  name,
  icon,
  children,
  isExpanded,
  onToggle,
  currentPath,
}: SidebarGroupProps) {
  const hasActiveChild = children.some((child) => currentPath === child.path);

  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className={cn(
          "group tuner-sidebar-item flex w-full items-center gap-3 transition-all duration-200 px-4 py-3",
          hasActiveChild
            ? "text-primary shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        style={{
          backgroundColor: hasActiveChild ? "color-mix(in srgb, var(--primary), transparent calc(100% - var(--sidebar-active-bg-opacity) * 100%))" : undefined
        }}
      >
        <span
          className={cn(
            "tuner-sidebar-icon flex items-center justify-center shrink-0",
            hasActiveChild
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {icon}
        </span>
        <span className="flex-1 text-left text-[1em] font-medium">{name}</span>
        <span
          className={cn(
            "transition-transform duration-200",
            hasActiveChild
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "mt-1 max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-border/50 ml-4 space-y-1 border-l-2 pl-3">
          {children.map((child) => (
            <SidebarItem
              key={child.path}
              name={child.name}
              path={child.path}
              icon={child.icon}
              isActive={currentPath === child.path}
              isSubItem
            />
          ))}
        </div>
      </div>
    </div>
  );
}
