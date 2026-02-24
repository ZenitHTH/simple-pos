import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="text-foreground mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className="border-border bg-card text-foreground flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={!selectedOption ? "text-muted-foreground" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FaChevronDown
            size={14}
            className={`text-muted transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div
            className="bg-popover border-border absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border shadow-lg"
            data-lenis-prevent
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`hover:bg-muted/10 cursor-pointer px-3 py-3 transition-colors ${
                  value === opt.value ? "bg-primary/10 text-primary" : ""
                }`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))}
            {options.length === 0 && (
              <div className="text-muted-foreground px-3 py-2 text-sm">
                No options
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Export Option for compatibility if needed, though we moved to props
export function Option({ children }: { children: React.ReactNode }) {
  return <option>{children}</option>;
}
