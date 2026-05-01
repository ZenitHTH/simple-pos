# System Alert Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all native browser `alert()` calls with a custom, persistent `AlertDialog` system. *Note: E2E testing is skipped for now.*

**Architecture:** 
- **Component**: `AlertDialog.tsx` (persistent modal-style dialog).
- **State Management**: `AlertContext.tsx` providing a global `showAlert` function.
- **Integration**: Update all management hooks and components to use the new system, utilizing the `.agents/ai-components.json` registry to audit and verify imports.

**Tech Stack:** React, Tailwind CSS, Node.js (for registry scanning).

---

### Task 1: Create AlertDialog System (Completed)

**Files:**
- Create: `src/components/ui/AlertDialog.tsx`
- Create: `src/context/AlertContext.tsx`
- Modify: `src/app/layout.tsx`

- [x] **Step 1: Create the AlertDialog UI component**
- [x] **Step 2: Create the AlertContext and Hook**
- [x] **Step 3: Register the AlertProvider in Root Layout**

---

### Task 2: Registry-Assisted Batch Migration (Completed)

**Files:**
- Modify: All files identified as needing migration.

- [x] **Step 1: Update hooks and components to use useAlert**
- [x] **Step 2: Use AI Registry for Verification**
The `.agents/ai-components.json` registry has been updated to track imports. Verify that all migrated files correctly import `@/context/AlertContext`.
- [x] **Step 3: Commit**

---

### Task 3: Complete the Development Branch

**Files:** None

- [ ] **Step 1: Verify the build**
Run `npm run build` to ensure the migration did not break the React/Next.js build.

- [ ] **Step 2: Wrap up**
Since E2E testing for the UI is skipped per user request, proceed to complete the development branch using the `finishing-a-development-branch` skill.
