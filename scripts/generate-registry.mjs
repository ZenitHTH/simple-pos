import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const FRONTEND_CONFIG = {
  scanDirs: [
    { path: 'src/components', type: 'component' },
    { path: 'src/hooks', type: 'hook' },
    { path: 'src/lib/api', type: 'api' }
  ],
  outputFile: '.agents/ai-components.json'
};

const BACKEND_CONFIG = {
  scanDirs: [
    { path: 'src-tauri/src/commands', type: 'rust-command' },
    { path: 'src-tauri/database/src', type: 'rust-db' },
    { path: 'src-tauri/export_lib/src', type: 'rust-lib' },
    { path: 'src-tauri/image_lib/src', type: 'rust-lib' },
    { path: 'src-tauri/settings_lib/src', type: 'rust-lib' }
  ],
  outputFile: '.agents/ai-backend.json'
};

/**
 * Generates a list of keywords from the name, path, and description.
 */
function generateKeywords(name, filePath, description, type) {
  const keywords = new Set();
  
  // Add name parts (split camelCase or snake_case)
  name.split(/(?=[A-Z])|_/).forEach(part => {
    if (part) keywords.add(part.toLowerCase());
  });
  keywords.add(name.toLowerCase());

  // Add path parts
  filePath.split(/[\\/]/).forEach(part => {
    const cleanPart = part.replace(/\.(tsx|ts|rs)$/, '');
    if (cleanPart && !['src', 'components', 'hooks', 'lib', 'api', 'src-tauri', 'commands'].includes(cleanPart)) {
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
 * Extracts metadata from a given TypeScript/React file.
 */
async function extractFrontendMetadata(filePath, type) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const results = [];

    const exportRegex = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/)?\s*export\s+(?:async\s+)?(?:const|function|default\s+function)\s+([a-zA-Z0-9_]+)?/g;
    
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      let [_, jsDoc, name] = match;
      
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
    console.error(`Error processing frontend file ${filePath}:`, err);
    return [];
  }
}

/**
 * Extracts metadata from a given Rust file.
 */
async function extractBackendMetadata(filePath, type) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const results = [];

    // Match pub fn, pub async fn, or #[tauri::command] followed by pub fn
    const rustRegex = /(?:\/\/\/([\s\S]*?)\n)?\s*(?:#\[tauri::command\]\s*)?pub\s+(?:async\s+)?fn\s+([a-zA-Z0-9_]+)\s*([\s\S]*?)\s*\{/g;
    
    let match;
    while ((match = rustRegex.exec(content)) !== null) {
      const [fullMatch, docComment, name, paramsAndReturn] = match;
      
      if (name.startsWith('_')) continue;

      const description = docComment
        ? docComment.split('\n').map(line => line.replace(/^\s*\/\/\/\s?/, '').trim()).filter(Boolean).join(' ')
        : 'No documentation provided.';

      const signature = `pub fn ${name}${paramsAndReturn.split('\n')[0].trim().replace(/\s+/g, ' ')}`;
      const normalizedPath = filePath.replace(/\\/g, '/');

      results.push({
        name,
        type,
        path: normalizedPath,
        description,
        signature,
        keywords: generateKeywords(name, normalizedPath, description, type)
      });
    }

    return results;
  } catch (err) {
    console.error(`Error processing backend file ${filePath}:`, err);
    return [];
  }
}

async function main() {
  console.log('Generating AI Component & Backend Registries...');
  
  // Frontend Registry
  const frontendTasks = FRONTEND_CONFIG.scanDirs.map(async (dirConfig) => {
    const files = await glob(`${dirConfig.path}/**/*.{ts,tsx}`);
    const dirResults = await Promise.all(
      files.map(file => extractFrontendMetadata(file, dirConfig.type))
    );
    return dirResults.flat();
  });

  const frontendResults = await Promise.all(frontendTasks);
  const frontendRegistry = frontendResults.flat();

  // Backend Registry
  const backendTasks = BACKEND_CONFIG.scanDirs.map(async (dirConfig) => {
    const files = await glob(`${dirConfig.path}/**/*.rs`);
    const dirResults = await Promise.all(
      files.map(file => extractBackendMetadata(file, dirConfig.type))
    );
    return dirResults.flat();
  });

  const backendResults = await Promise.all(backendTasks);
  const backendRegistry = backendResults.flat();

  // Ensure output directory exists
  const outputDir = '.agents';
  await fs.mkdir(outputDir, { recursive: true });

  // Save Frontend
  await fs.writeFile(FRONTEND_CONFIG.outputFile, JSON.stringify(frontendRegistry, null, 2));
  console.log(`Frontend Registry generated with ${frontendRegistry.length} entries at ${FRONTEND_CONFIG.outputFile}`);

  // Save Backend
  await fs.writeFile(BACKEND_CONFIG.outputFile, JSON.stringify(backendRegistry, null, 2));
  console.log(`Backend Registry generated with ${backendRegistry.length} entries at ${BACKEND_CONFIG.outputFile}`);
}

main().catch(err => {
  console.error('Failed to generate registries:', err);
  process.exit(1);
});
