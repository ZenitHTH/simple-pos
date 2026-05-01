"use client";

import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib";

/**
 * Props for the SearchInput component.
 */
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The current search query value. */
  value: string;
  /** Callback triggered when the input value changes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional placeholder text. Defaults to "Search...". */
  placeholder?: string;
  /** Optional CSS class for the input element. */
  className?: string;
  /** Optional CSS class for the container div. */
  containerClassName?: string;
}

/**
 * A reusable search input component with an icon.
 * Features a magnifying glass icon and standard input behavior.
 *
 * @param props - The search input props.
 * @returns A styled search input element.
 */
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
      <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "border-border bg-card focus-visible:ring-primary/50 w-full rounded-xl border py-2.5 pr-4 pl-10 transition-all outline-none focus-visible:ring-2",
          className,
        )}
        {...props}
      />
    </div>
  );
}
