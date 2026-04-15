// Save this as scripts/add-jsdocs.mjs
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const targets = [
    'src/components/design-tuner/**/*.tsx',
    'src/components/settings/**/*.tsx',
    'src/components/layout/*.tsx',
    'src/components/history/*.tsx',
    'src/components/payment/PaymentModal.tsx'
];

const files = targets.flatMap(pattern => globSync(pattern, { absolute: true }));
const jsdocTemplate = (name) => {
    const isComponent = /^[A-Z]/.test(name);
    if (isComponent) {
        return `/**\n * ${name} Component\n * \n * @param {Object} props - The properties object.\n * @returns {JSX.Element | null} The rendered component.\n */\n`;
    }
    return `/**\n * ${name}\n */\n`;
};

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    const exportRegex = /(?<!\/\*\*\s*\n(?:[^\*]*\*[^\/]*\n)*\s*)\b(export\s+(?:default\s+)?(?:const|function)\s+([a-zA-Z0-9_]+))/g;
    content = content.replace(exportRegex, (match, fullExport, name) => {
        modified = true;
        return jsdocTemplate(name) + fullExport;
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated JSDocs in: ${path.relative(process.cwd(), file)}`);
    }
});
