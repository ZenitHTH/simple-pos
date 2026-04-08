"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBoxOpen,
  FaCog,
  FaTags,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaWarehouse,
  FaClipboardList,
  FaImages,
} from "react-icons/fa";

import { useSettings } from "@/context/SettingsContext";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";
import { cn } from "@/lib";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarGroup } from "./sidebar/SidebarGroup";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  name: string;
  icon: React.ReactNode;
  children: MenuItem[];
}

type MenuEntry = MenuItem | MenuGroup;

function isGroup(entry: MenuEntry): entry is MenuGroup {
  return "children" in entry;
}

const menuEntries: MenuEntry[] = [
  {
    name: "Main Page",
    path: "/",
    icon: <FaHome size={20} />,
  },
  {
    name: "Management",
    icon: <FaClipboardList size={20} />,
    children: [
      {
        name: "Product Management",
        path: "/manage",
        icon: <FaBoxOpen size={18} />,
      },
      {
        name: "Inventory & Stock",
        path: "/manage/stock",
        icon: <FaWarehouse size={18} />,
      },
      {
        name: "Images",
        path: "/manage/images",
        icon: <FaImages size={18} />,
      },
      {
        name: "Categories",
        path: "/manage/categories",
        icon: <FaTags size={18} />,
      },
      {
        name: "Customers",
        path: "/manage/customers",
        icon: <FaClipboardList size={18} />,
      },
    ],
  },
  {
    name: "System Setting",
    icon: <FaCog size={20} />,
    children: [
      {
        name: "General",
        path: "/setting/general",
        icon: <FaCog size={18} />,
      },
      {
        name: "Finance",
        path: "/setting/finance",
        icon: <FaTags size={18} />,
      },
      {
        name: "Export",
        path: "/setting/export",
        icon: <FaClipboardList size={18} />,
      },
    ],
  },
];

export default function Sidebar() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  // Calculate dynamic width (base 16rem = 256px)
  const baseWidth = 256;
  const dynamicWidth = `${baseWidth * ((settings?.sidebar_scale || 100) / 100)}px`;

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Auto-expand groups that contain the active route
  useEffect(() => {
    menuEntries.forEach((entry) => {
      if (isGroup(entry)) {
        const hasActiveChild = entry.children.some(
          (child) => pathname === child.path,
        );
        if (hasActiveChild) {
          setExpandedGroups((prev) => ({ ...prev, [entry.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  if (pathname.startsWith("/design/tuner")) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-card border-border fixed top-0 right-0 left-0 z-40 flex h-16 items-center border-b px-4 shadow-sm lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="text-muted hover:text-foreground -ml-2 p-2 transition-colors"
        >
          <FaBars size={24} />
        </button>
        <span className="text-primary ml-4 text-[1.125em] font-bold">
          Simple POS
        </span>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: dynamicWidth }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:static",
          "bg-card text-card-foreground border-border border-r shadow-2xl lg:shadow-none",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          style={{
            width: dynamicWidth,
            fontSize: `${settings?.sidebar_font_scale || 100}%`,
          }}
          className="group relative flex h-full flex-col"
        >
          <div className="flex items-center justify-between p-6 lg:block">
            <h1 className="text-primary text-[1.5em] font-bold">POS System</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-foreground p-2 transition-colors lg:hidden"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <nav
            className="flex-1 space-y-2 overflow-y-auto px-4 py-4"
            data-lenis-prevent
          >
            {menuEntries.map((entry) =>
              isGroup(entry) ? (
                <SidebarGroup
                  key={entry.name}
                  name={entry.name}
                  icon={entry.icon}
                  children={entry.children}
                  isExpanded={expandedGroups[entry.name] ?? false}
                  onToggle={() => toggleGroup(entry.name)}
                  currentPath={pathname}
                />
              ) : (
                <SidebarItem
                  key={entry.path}
                  name={entry.name}
                  path={entry.path}
                  icon={entry.icon}
                  isActive={pathname === entry.path}
                />
              ),
            )}
          </nav>

          <div className="border-border mt-auto border-t p-4">
            <p className="text-muted text-center text-[0.75em]">
              © 2026 Simple POS
            </p>
          </div>

          <SelectableOverlay id="sidebar_scale" />
        </div>
      </aside>
    </>
  );
}
