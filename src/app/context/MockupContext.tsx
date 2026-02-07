"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface MockupContextType {
    isMockupMode: boolean;
    selectedElementId: string | null;
    selectElement: (id: string | null) => void;
    toggleMockupMode: () => void;
}

const MockupContext = createContext<MockupContextType | undefined>(undefined);

export function MockupProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isMockupMode, setIsMockupMode] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    const toggleMockupMode = () => {
        setIsMockupMode(prev => {
            const newValue = !prev;
            if (!newValue) setSelectedElementId(null);
            return newValue;
        });
    };

    // Auto-enable if on /mockup route (backward compatibility or direct link)
    useEffect(() => {
        if (pathname.startsWith('/mockup')) {
            setIsMockupMode(true);
        }
    }, [pathname]);

    return (
        <MockupContext.Provider value={{
            isMockupMode,
            selectedElementId,
            selectElement: setSelectedElementId,
            toggleMockupMode
        }}>
            {children}
        </MockupContext.Provider>
    );
}

export function useMockup() {
    const context = useContext(MockupContext);
    if (!context) {
        throw new Error('useMockup must be used within a MockupProvider');
    }
    return context;
}
