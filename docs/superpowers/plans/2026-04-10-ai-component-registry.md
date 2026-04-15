# AI Component Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an automated "yellow pages" registry of UI components, hooks, and API functions to help AI agents navigate the codebase efficiently.

**Architecture:** A Node.js ESM script (`scripts/generate-registry.mjs`) will scan target directories using glob patterns, extract metadata via regex-based parsing of JSDoc and export statements, and save the result to `.agents/ai-components.json`.

**Tech Stack:** Node.js, File System (fs/promises), Path, Glob (via `glob` package already present in devDependencies).

---

### Task 1: Setup Script Skeleton and NPM Command

**Files:**
- Create: `scripts/generate-registry.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the basic script structure**

```javascript
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const CONFIG = {
  scanDirs: [
    { path: 'src/components', type: 'component' },
    { path: 'src/hooks', type: 'hook' },
    { path: 'src/lib/api', type: 'api' }
  ],
  outputFile: '.agents/ai-components.json'
};

async function main() {
  console.log('Generating AI Component Registry...');
  // Logic goes here
}

main().catch(err => {
  console.error('Failed to generate registry:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Add npm script to package.json**

Modify `package.json` to include:
```json
"scripts": {
  "registry": "node scripts/generate-registry.mjs",
  ...
}
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-registry.mjs package.json
git commit -m "chore: setup AI registry script skeleton"
```

### Task 2: Implement File Scanning and Metadata Extraction

**Files:**
- Modify: `scripts/generate-registry.mjs`

- [ ] **Step 1: Implement the scanning and extraction logic**

```javascript
async function extractMetadata(filePath, type) {
  const content = await fs.readFile(filePath, 'utf-8');
  const results = [];

  // Match JSDoc and Exports
  // This is a simplified regex-based approach for the "yellow pages"
  const exportRegex = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/)?\s*export\s+(?:async\s+)?(?:const|function|type|interface)\s+([a-zA-Z0-9_]+)/g;
  
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const [_, jsDoc, name] = match;
    
    // Filter out internal helpers (starting with underscore or lowercase in components)
    if (name.startsWith('_')) continue;
    if (type === 'component' && /^[a-z]/.test(name)) continue;

    results.push({
      name,
      type,
      path: filePath.replace(/\\/g, '/'),
      description: jsDoc ? jsDoc.replace(/\n\s*\*\s?/g, ' ').trim() : 'No description provided.',
    });
  }

  return results;
}

async function main() {
  const registry = [];

  for (const dirConfig of CONFIG.scanDirs) {
    const files = await glob(`${dirConfig.path}/**/*.{ts,tsx}`);
    for (const file of files) {
      const metadata = await extractMetadata(file, dirConfig.type);
      registry.push(...metadata);
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(CONFIG.outputFile);
  await fs.mkdir(outputDir, { recursive: true });

  await fs.writeFile(CONFIG.outputFile, JSON.stringify(registry, null, 2));
  console.log(`Registry generated with ${registry.length} entries at ${CONFIG.outputFile}`);
}
```

- [ ] **Step 2: Run the script to verify basic extraction**

Run: `npm run registry`
Expected: Output showing registry generated with multiple entries.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-registry.mjs
git commit -m "feat: implement registry extraction logic"
```

### Task 3: Refine Extraction and JSDoc Handling

**Files:**
- Modify: `scripts/generate-registry.mjs`

- [ ] **Step 1: Improve JSDoc cleaning and Props detection**

Update `extractMetadata` to handle multi-line JSDoc better and try to find prop types.

```javascript
async function extractMetadata(filePath, type) {
  const content = await fs.readFile(filePath, 'utf-8');
  const results = [];

  // Regex for exports with optional JSDoc
  const exportRegex = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/)?\s*export\s+(?:async\s+)?(?:const|function)\s+([a-zA-Z0-9_]+)/g;
  
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const [_, jsDoc, name] = match;
    
    if (name.startsWith('_')) continue;
    if (type === 'component' && /^[a-z]/.test(name)) continue;
    if (type === 'hook' && !name.startsWith('use')) continue;

    const description = jsDoc 
      ? jsDoc.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim()).filter(Boolean).join(' ')
      : 'No description provided.';

    // Heuristic for Props (looks for interface or type with same name + Props)
    const propsRegex = new RegExp(`(?:interface|type)\\s+(${name}Props)\\b`);
    const propsMatch = content.match(propsRegex);

    results.push({
      name,
      type,
      path: filePath.replace(/\\/g, '/'),
      description,
      props: propsMatch ? propsMatch[1] : null
    });
  }

  return results;
}
```

- [ ] **Step 2: Run and verify enriched data**

Run: `npm run registry`
Check `.agents/ai-components.json` for `props` fields and cleaner descriptions.

- [ ] **Step 3: Commit**

```bash
git commit -am "feat: refine metadata extraction and JSDoc cleaning"
```

### Task 4: Final Validation and Documentation

**Files:**
- Modify: `GEMINI.md`

- [ ] **Step 1: Add a note to GEMINI.md about the registry**

Add to the "Development Conventions" section:
```markdown
### AI Component Registry
We maintain a "yellow pages" registry of reusable components, hooks, and API functions in `.agents/ai-components.json`. 
Update it by running:
`npm run registry`
AI agents should check this file first when looking for existing functionality.
```

- [ ] **Step 2: Final run and check-in of the registry**

Run: `npm run registry`
Verify `.agents/ai-components.json` is populated correctly.

- [ ] **Step 3: Commit**

```bash
git add .agents/ai-components.json GEMINI.md
git commit -m "docs: register AI component registry in GEMINI.md"
```
