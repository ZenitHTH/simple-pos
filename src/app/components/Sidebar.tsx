"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBoxOpen, FaCog } from "react-icons/fa";

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
        name: "System Setting",
        path: "/setting",
        icon: <FaCog size={20} />,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-card-bg border-r border-border min-h-screen flex flex-col shadow-sm">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary">POS System</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
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
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <p className="text-xs text-center text-muted">© 2026 Simple POS</p>
            </div>
        </aside>
    );
}
