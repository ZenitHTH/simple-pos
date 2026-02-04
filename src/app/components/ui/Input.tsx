import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1 text-foreground">{label}</label>}
            <input
                className={`w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted ${className}`}
                {...props}
            />
        </div>
    );
}
