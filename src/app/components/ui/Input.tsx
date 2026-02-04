import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <input
                className={`w-full px-3 py-2 rounded-lg border border-border bg-zinc-800 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-400 ${className}`}
                style={{ backgroundColor: '#27272a' }}
                {...props}
            />
        </div>
    );
}
