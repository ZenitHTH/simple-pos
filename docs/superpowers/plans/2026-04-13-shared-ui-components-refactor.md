# Shared UI Components Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract frequently repeated UI patterns (Search, Badges, Empty States) from domain components into globally reusable atomic components in `src/components/ui/`.

**Architecture:** We will create atomic, stateless functional components using React and Tailwind CSS. We will then refactor the existing Management and POS views to consume these new shared primitives, reducing code duplication and improving consistency.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, react-icons.

---

### Task 1: Implement `SearchInput` Component [DONE]

**Files:**
- Create: `src/components/ui/SearchInput.tsx`
- Modify: `src/components/layout/ManagementPageLayout.tsx`
- Modify: `src/components/manage/recipe/MaterialSidebar.tsx`
- Modify: `src/components/manage/recipe/ProductSidebar.tsx`

- [ ] **Step 1: Create the SearchInput Component**

```tsx
// src/components/ui/SearchInput.tsx
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
```

- [ ] **Step 2: Refactor ManagementPageLayout to use SearchInput**

Modify `src/components/layout/ManagementPageLayout.tsx`:
Add import: `import { SearchInput } from "@/components/ui/SearchInput";`
Replace the custom search div with:

```tsx
          {setSearchQuery && (
            <div className="mb-6">
              <SearchInput
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
```

- [ ] **Step 3: Refactor POSProductGrid to use SearchInput**

Modify `src/components/pos/POSProductGrid.tsx`:
Add import: `import { SearchInput } from "@/components/ui/SearchInput";`
Replace the custom search div with:

```tsx
        <SearchInput
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          containerClassName="w-64 max-w-none"
        />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SearchInput.tsx src/components/layout/ManagementPageLayout.tsx src/components/pos/POSProductGrid.tsx
git commit -m "refactor: extract SearchInput and update Layout/POS views"
```

### Task 2: Implement `Badge` Component

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Modify: `src/components/manage/ProductTable.tsx`
- Modify: `src/components/manage/MaterialTable.tsx`

- [ ] **Step 1: Create the Badge Component**

```tsx
// src/components/ui/Badge.tsx
import * as React from "react";
import { cn } from "@/lib";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "primary-subtle";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-destructive text-destructive-foreground": variant === "destructive",
          "text-foreground border border-input": variant === "outline",
          "bg-primary/10 text-primary": variant === "primary-subtle",
        },
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Refactor ProductTable to use Badge**

Modify `src/components/manage/ProductTable.tsx`:
Add import: `import { Badge } from "@/components/ui/Badge";`
Replace the category span with:

```tsx
          header: "Category",
          render: (product) => {
            const cat = categories.find((c) => c.id === product.category_id);
            return (
              <Badge variant="primary-subtle" className="rounded-md px-2 py-1 text-sm font-medium">
                {cat ? cat.name : "Unknown"}
              </Badge>
            );
          },
```

- [ ] **Step 3: Refactor MaterialTable to use Badge**

Modify `src/components/manage/MaterialTable.tsx`:
Add import: `import { Badge } from "@/components/ui/Badge";`
Replace type and tag spans:

```tsx
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="rounded-full">
                    {m.type_}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {m.tags && m.tags.length > 0 ? (
                      m.tags.map((tag) => (
                        <Badge key={tag} variant="primary-subtle" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider border border-primary/10">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground/50 text-[10px] italic">
                        No tags
                      </span>
                    )}
                  </div>
                </td>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Badge.tsx src/components/manage/ProductTable.tsx src/components/manage/MaterialTable.tsx
git commit -m "refactor: extract Badge component and update tables"
```

### Task 3: Implement `EmptyState` Component [DONE]

**Files:**
- Create: `src/components/ui/EmptyState.tsx`
- Modify: `src/components/ui/GlobalTable.tsx`
- Modify: `src/components/manage/MaterialTable.tsx`

- [x] **Step 1: Create the EmptyState Component**

```tsx
// src/components/ui/EmptyState.tsx
import * as React from "react";
import { cn } from "@/lib";
import { FaBoxOpen } from "react-icons/fa";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ message, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("text-muted-foreground flex flex-col items-center justify-center p-8 text-center gap-3", className)}>
      {icon ? (
        <div className="text-muted-foreground/30 text-5xl mb-2">{icon}</div>
      ) : (
        <FaBoxOpen className="text-muted-foreground/20 text-5xl mb-2" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
```

- [x] **Step 2: Refactor GlobalTable to use EmptyState**

Modify `src/components/ui/GlobalTable.tsx`:
Add import: `import { EmptyState } from "@/components/ui/EmptyState";`
Replace empty message logic:

```tsx
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16">
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
```

- [x] **Step 3: Refactor MaterialTable to use EmptyState**

Modify `src/components/manage/MaterialTable.tsx`:
Add import: `import { EmptyState } from "@/components/ui/EmptyState";`
Update early return:

```tsx
  if (materials.length === 0) {
    return (
      <EmptyState
        message="No materials found. Add some materials to get started."
        className="h-64 border border-dashed rounded-xl"
      />
    );
  }
```

- [x] **Step 4: Commit**

```bash
git add src/components/ui/EmptyState.tsx src/components/ui/GlobalTable.tsx src/components/manage/MaterialTable.tsx
git commit -m "refactor: extract EmptyState component and standardise"
```

### Task 4: Move `VirtualNumpad` and Create `TableActionButton`

**Files:**
- Move: `src/components/payment/VirtualNumpad.tsx` -> `src/components/ui/VirtualNumpad.tsx`
- Modify: `src/components/payment/CashInput.tsx` (update import)
- Modify: `src/components/payment/PaymentModal.tsx` (update import)
- Create: `src/components/ui/TableActionButton.tsx`
- Modify: `src/components/manage/ProductTable.tsx`
- Modify: `src/components/manage/MaterialTable.tsx`

- [ ] **Step 1: Move VirtualNumpad**

```bash
git mv src/components/payment/VirtualNumpad.tsx src/components/ui/VirtualNumpad.tsx
```
*Note: Update the imports in `src/components/payment/CashInput.tsx` and `src/components/payment/PaymentModal.tsx` to point to `@/components/ui/VirtualNumpad`.*

- [ ] **Step 2: Create TableActionButton**

```tsx
// src/components/ui/TableActionButton.tsx
import * as React from "react";
import { cn } from "@/lib";

interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  icon: React.ReactNode;
}

export function TableActionButton({
  className,
  variant = "default",
  icon,
  title,
  ...props
}: TableActionButtonProps) {
  return (
    <button
      title={title}
      className={cn(
        "rounded-lg p-2 transition-colors",
        {
          "text-muted-foreground hover:text-primary hover:bg-primary/10": variant === "default",
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10": variant === "destructive",
        },
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
```

- [ ] **Step 3: Refactor ProductTable to use TableActionButton**

Modify `src/components/manage/ProductTable.tsx`:
Add import: `import { TableActionButton } from "@/components/ui/TableActionButton";`
Replace action buttons:

```tsx
              <TableActionButton
                onClick={() => onEdit(product)}
                icon={<FaEdit />}
                title="Edit"
              />
              <TableActionButton
                variant="destructive"
                onClick={() => onDelete(product.product_id)}
                icon={<FaTrash />}
                title="Delete"
              />
```

- [ ] **Step 4: Refactor MaterialTable to use TableActionButton**

Modify `src/components/manage/MaterialTable.tsx`:
Add import: `import { TableActionButton } from "@/components/ui/TableActionButton";`
Replace action buttons:

```tsx
                    <TableActionButton
                      onClick={() => onEdit(m)}
                      icon={<FaEdit size={16} />}
                      title="Edit material"
                    />
                    <TableActionButton
                      variant="destructive"
                      onClick={() => onDelete(m.id)}
                      icon={<FaTrash size={16} />}
                      title="Delete material"
                    />
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/VirtualNumpad.tsx src/components/ui/TableActionButton.tsx src/components/payment/CashInput.tsx src/components/payment/PaymentModal.tsx src/components/manage/ProductTable.tsx src/components/manage/MaterialTable.tsx
git commit -m "refactor: promote VirtualNumpad to UI and extract TableActionButton"
```
