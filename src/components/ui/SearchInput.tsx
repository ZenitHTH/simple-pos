"use client";

import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full max-w-md", containerClassName)}>
      <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-3 -translate-y-1/2 text-sm z-10" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "border-border bg-card focus-visible:ring-primary/50 w-full rounded-xl border py-2.5 pr-4 pl-10 outline-none focus-visible:ring-2 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}
