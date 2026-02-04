import React from "react";
import { FaChevronDown } from "react-icons/fa6";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: { value: string | number; label: string }[];
}

export function Select({ label, options, children, className = "", ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1 text-foreground">{label}</label>}
            <div className="relative">
                <select
                    className={`w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none pr-10 ${className}`}
                    {...props}
                >
                    {options
                        ? options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-card-bg text-foreground">
                                {opt.label}
                            </option>
                        ))
                        : children}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <FaChevronDown size={14} />
                </div>
            </div>
        </div>
    );
}

export function Option({ children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
    return (
        <option className="bg-card-bg text-foreground" {...props}>
            {children}
        </option>
    );
}
