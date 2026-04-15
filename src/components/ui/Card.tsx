import * as React from "react";
import { cn } from "@/lib";

/**
 * Card component used for grouping content.
 * Follows the standard card pattern with header, title, description, content, and footer sub-components.
 */
const Card = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground border-border rounded-2xl border shadow-md",
      className,
    )}
    {...props}
  />
);
Card.displayName = "Card";

/**
 * Header section of a Card, typically containing the CardTitle and CardDescription.
 */
const CardHeader = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

/**
 * Title component for the CardHeader.
 */
const CardTitle = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"h3">) => (
  <h3
    ref={ref}
    className={cn("text-xl leading-none font-bold tracking-tight", className)}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

/**
 * Description component for the CardHeader, providing additional context.
 */
const CardDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"p">) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm leading-relaxed", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

/**
 * Main content area of the Card.
 */
const CardContent = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

/**
 * Footer section of the Card, typically used for actions or metadata.
 */
const CardFooter = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
