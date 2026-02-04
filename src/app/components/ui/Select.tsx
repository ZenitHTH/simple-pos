import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: { value: string | number; label: string }[];
}

export function Select({ label, options, children, className = "", ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <select
                className={`w-full px-3 py-2 rounded-lg border border-border bg-zinc-800 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none ${className}`}
                style={{
                    backgroundColor: '#27272a',
                    color: 'white',
                    colorScheme: 'dark',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                }}
                {...props}
            >
                {options
                    ? options.map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: '#27272a', color: 'white' }}>
                            {opt.label}
                        </option>
                    ))
                    : children}
            </select>
        </div>
    );
}

export function Option({ children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
    return (
        <option style={{ backgroundColor: '#27272a', color: 'white' }} {...props}>
            {children}
        </option>
    );
}
