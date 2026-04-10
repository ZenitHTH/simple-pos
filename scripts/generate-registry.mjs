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
 * Generates a list of keywords from the name, path, and description.
 */
function generateKeywords(name, filePath, description, type) {
  const keywords = new Set();
  
  // Add name parts (split camelCase)
  name.split(/(?=[A-Z])|_/).forEach(part => {
    if (part) keywords.add(part.toLowerCase());
  });
  keywords.add(name.toLowerCase());

  // Add path parts
  filePath.split(/[\\/]/).forEach(part => {
    const cleanPart = part.replace(/\.(tsx|ts)$/, '');
    if (cleanPart && !['src', 'components', 'hooks', 'lib', 'api'].includes(cleanPart)) {
      keywords.add(cleanPart.toLowerCase());
    }
  });

  // Add words from description
  description.toLowerCase().split(/\W+/).forEach(word => {
    if (word.length > 3) keywords.add(word);
  });

  // Add type
  keywords.add(type);

  return Array.from(keywords);
}

/**
 * Extracts metadata from a given file including JSDoc and exports.
 * @param {string} filePath - Path to the file to scan.
 * @param {string} type - Category of the file (component, hook, or api).
 * @returns {Promise<Array>} - Extracted metadata items.
 */
async function extractMetadata(filePath, type) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const results = [];

    // Regex for exports with optional JSDoc
    const exportRegex = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/)?\s*export\s+(?:async\s+)?(?:const|function|default\s+function)\s+([a-zA-Z0-9_]+)?/g;
    
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      let [_, jsDoc, name] = match;
      
      // Handle default exports without explicit names
      if (!name) {
        if (content.includes('export default')) {
          name = path.basename(filePath, path.extname(filePath));
        } else {
          continue;
        }
      }

      if (name.startsWith('_')) continue;
      if (type === 'component' && /^[a-z]/.test(name) && !content.includes('export default')) continue;
      if (type === 'hook' && !name.startsWith('use')) continue;

      const description = jsDoc 
        ? jsDoc.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim()).filter(Boolean).join(' ')
        : 'No description provided.';

      // Heuristic for Props (looks for interface or type with same name + Props)
      const propsRegex = new RegExp(`(?:interface|type)\\s+(${name}Props)\\b`);
      const propsMatch = content.match(propsRegex);

      const normalizedPath = filePath.replace(/\\/g, '/');

      results.push({
        name,
        type,
        path: normalizedPath,
        description,
        keywords: generateKeywords(name, normalizedPath, description, type),
        props: propsMatch ? propsMatch[1] : null
      });
    }

    return results;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return [];
  }
}

async function main() {
  console.log('Generating AI Component Registry...');
  
  const tasks = CONFIG.scanDirs.map(async (dirConfig) => {
    const files = await glob(`${dirConfig.path}/**/*.{ts,tsx}`);
    const dirResults = await Promise.all(
      files.map(file => extractMetadata(file, dirConfig.type))
    );
    return dirResults.flat();
  });

  const allResults = await Promise.all(tasks);
  const registry = allResults.flat();

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
