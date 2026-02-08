"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBoxOpen, FaCog, FaTags, FaBars, FaTimes } from "react-icons/fa";

import { useSettings } from "../context/SettingsContext";
import SelectableOverlay from './design-mode/SelectableOverlay';

const menuItems = [
    {
        name: "Main Page",
        path: "/",
        icon: <FaHome size={20} />,
    },
    {
        name: "Product Management",
        path: "/manage",
        icon: <FaBoxOpen size={20} />,
    },
    {
        name: "Categories",
        path: "/manage/categories",
        icon: <FaTags size={20} />,
    },
    {
        name: "System Setting",
        path: "/setting",
        icon: <FaCog size={20} />,
    },
];

export default function Sidebar() {
    const { settings } = useSettings();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Calculate dynamic width (base 16rem = 256px)
    const baseWidth = 256;
    const dynamicWidth = `${baseWidth * ((settings?.sidebar_scale || 100) / 100)}px`;

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card-bg border-b border-border flex items-center px-4 z-40 shadow-sm">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -ml-2 text-muted hover:text-foreground transition-colors"
                >
                    <FaBars size={24} />
                </button>
                <span className="ml-4 text-[1.125em] font-bold text-primary">Simple POS</span>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{ width: dynamicWidth }}
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    bg-card-bg border-r border-border shadow-2xl lg:shadow-none
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            // We need to apply width specifically for desktop static layout
            // But tailwind class w-64 is applied. We should override it or use style.
            >
                {/* We use a style injection or inline style wrapper to handle the dynamic width properly */}
                <div
                    style={{
                        width: dynamicWidth,
                        fontSize: `${settings?.sidebar_font_scale || 100}%`
                    }}
                    className="h-full flex flex-col relative group"
                >
                    <SelectableOverlay id="sidebar_scale" />

                    <div className="p-6 flex justify-between items-center lg:block">
                        <h1 className="text-[1.5em] font-bold text-primary">POS System</h1>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-muted hover:text-foreground transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-blue-500/20"
                                            : "text-muted hover:bg-card-hover hover:text-foreground"
                                        }
                                `}
                                >
                                    <span className={isActive ? "text-primary-foreground" : "text-muted group-hover:text-foreground"}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium text-[1em]">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-border mt-auto">
                        <p className="text-[0.75em] text-center text-muted">© 2026 Simple POS</p>
                    </div>

                </div>
            </aside>
        </>
    );
}
