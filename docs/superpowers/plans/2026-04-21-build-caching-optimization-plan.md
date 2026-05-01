# Build & Caching Optimizations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable Next.js 16 performance features (Turbopack caching and React Compiler).

**Architecture:** Modify the central `next.config.ts` to include experimental flags.

**Tech Stack:** Next.js 16, TypeScript.

---

### Task 1: Update next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Apply experimental flags to next.config.ts**

Modify `next.config.ts` to include the `experimental` block:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    reactCompiler: true,
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit the change**

```bash
git add next.config.ts
git commit -m "feat: enable turbopack caching and react compiler"
```

---

### Task 2: Verification

- [ ] **Step 1: Run build to verify configuration is valid**

Run: `npm run build`
Expected: Build completes without errors related to the new configuration flags.

- [ ] **Step 2: Verify file content**

Run: `grep -E "turbopackFileSystemCacheForDev|reactCompiler" next.config.ts`
Expected: Both flags are present and set to `true`.
