import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa6";
import { cn } from "@/lib";
import { SelectOption } from "@/lib/types/common";

/**
 * Props for the Select component.
 */
interface SelectProps {
  /** Optional label to display above the select box. */
  label?: string;
  /** The current selected value. */
  value?: string | number;
  /** Callback function triggered when an option is selected. */
  onChange: (value: string | number) => void;
  /** Array of options to display in the dropdown. */
  options: SelectOption[];
  /** Optional placeholder text shown when no value is selected. Defaults to "Select...". */
  placeholder?: string;
  /** Optional additional CSS classes for the container. */
  className?: string;
}

/**
 * A custom-styled dropdown select component.
 * Features a searchable-like feel, custom popover, and smooth transitions.
 * 
 * @param props - The select component props.
 * @returns A custom dropdown select element.
 */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      {label && (
        <label className="text-foreground mb-1.5 block text-sm font-semibold">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={cn(
            "border-border bg-card text-foreground flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all duration-150",
            isOpen
              ? "border-primary/50 ring-primary/30 ring-2"
              : "hover:bg-muted/30 hover:border-border/80",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={!selectedOption ? "text-muted-foreground/60" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FaChevronDown
            size={12}
            className={cn(
              "text-muted-foreground/70 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>

        {isOpen && (
          <div
            className="bg-popover border-border animate-in fade-in-0 zoom-in-95 absolute z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border shadow-xl duration-100"
            data-lenis-prevent
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm transition-colors",
                  value === opt.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50",
                )}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {value === opt.value && (
                  <FaCheck size={11} className="text-primary shrink-0" />
                )}
              </div>
            ))}
            {options.length === 0 && (
              <div className="text-muted-foreground px-3 py-3 text-center text-sm">
                No options
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A legacy or helper component for representing an option in the select.
 * Used for compatibility where standard option elements might be expected.
 * 
 * @param props - Component children.
 * @returns A standard HTML option element.
 */
export function Option({ children }: { children: React.ReactNode }) {
  return <option>{children}</option>;
}
