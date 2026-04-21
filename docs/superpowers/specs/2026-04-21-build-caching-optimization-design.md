# Design Doc: Build & Caching Optimizations

## Goal
Enable Next.js 16 performance features to improve development speed and runtime efficiency.

## Context
Next.js 16 (with React 19) provides advanced experimental features that leverage Turbopack for faster rebuilds and the React Compiler for automatic memoization.

## Proposed Changes

### 1. Enable Turbopack File System Caching
- **Flag**: `experimental.turbopackFileSystemCacheForDev: true`
- **Purpose**: Persists Turbopack's intermediate compilation results to disk, significantly reducing startup and HMR times in development.

### 2. Enable React Compiler
- **Flag**: `experimental.reactCompiler: true`
- **Purpose**: Enables the React Compiler (formerly React Forget) to automatically optimize components, reducing the need for manual `useMemo` and `useCallback`.

## Implementation Details

Modify `next.config.ts` in the root:

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

## Risks and Mitigations
- **Experimental Features**: These flags are experimental. If stability issues arise in development, they can be easily toggled off.
- **React Compiler Compatibility**: While React 19 supports the compiler, some complex patterns might need adjustment. Mitigation: Monitor for hydration or runtime errors.

## Success Criteria
- `next.config.ts` updated correctly.
- Project builds successfully.
- Turbopack caching is active in dev mode.
