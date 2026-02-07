"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCompass, FaHome, FaBoxOpen, FaTags, FaCog } from "react-icons/fa";

export default function NavigationMenu({ router }: { router: ReturnType<typeof useRouter> }) {
    const [isOpen, setIsOpen] = useState(false);

    const navigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
            >
                <FaCompass />
                <span>Navigate</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-4 w-56 bg-card-bg border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-2 space-y-1">
                        <NavButton onClick={() => navigate('/')} icon={<FaHome />} label="Main Page" />
                        <NavButton onClick={() => navigate('/manage')} icon={<FaBoxOpen />} label="Product Manage" />
                        <NavButton onClick={() => navigate('/manage/categories')} icon={<FaTags />} label="Categories" />
                        <hr className="border-border my-1" />
                        <NavButton onClick={() => navigate('/setting')} icon={<FaCog />} label="Settings" />
                    </div>
                </div>
            )}
        </div>
    );
}

function NavButton({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors">
            <span className="text-muted">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
}
