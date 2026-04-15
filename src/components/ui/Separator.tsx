import { cn } from "@/lib";

/**
 * Props for the Separator component.
 */
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The orientation of the separator. Defaults to "horizontal". */
    orientation?: "horizontal" | "vertical";
}

/**
 * A simple visual separator component used to divide content.
 * Can be oriented horizontally or vertically.
 * 
 * @param props - The separator props.
 * @returns A styled div acting as a separator.
 */
export function Separator({
    className,
    orientation = "horizontal",
    ...props
}: SeparatorProps) {
    return (
        <div
            className={cn(
                "bg-border shrink-0",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    );
}
