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
  FaWarehouse,
  FaClipboardList,
  FaImages,
} from "react-icons/fa";

import { useSettings } from "@/context/settings/SettingsContext";
import { cn } from "@/lib";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarGroup } from "./sidebar/SidebarGroup";
import BaseSidebarLayout from "./BaseSidebarLayout";

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
      <BaseSidebarLayout
        title="POS System"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scale={settings?.sidebar_scale}
        fontScale={settings?.sidebar_font_scale}
      >
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
      </BaseSidebarLayout>
    </>
  );
}
