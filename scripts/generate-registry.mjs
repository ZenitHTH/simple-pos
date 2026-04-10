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

/**
 * Extracts metadata from a given file including JSDoc and exports.
 * @param {string} filePath - Path to the file to scan.
 * @param {string} type - Category of the file (component, hook, or api).
 * @returns {Promise<Array>} - Extracted metadata items.
 */
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

async function main() {
  console.log('Generating AI Component Registry...');
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

main().catch(err => {
  console.error('Failed to generate registry:', err);
  process.exit(1);
});
