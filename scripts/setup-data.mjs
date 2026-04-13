import { fs } from 'fs';
import { promisify } from 'util';

const copyFile = promisify(fs.copyFile);
const copyDir = promisify(fs.copyDir);

function setupProductData() {
  const dataDir = './e2e/playwright/data/products/';
  const productsDir = dataDir + 'products';

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  fs.readdirSync(dataDir).forEach((file) =
    fs.readFileSync(file, 'utf-8')
  ).then(data => {
    console.log('Found subdirectory:', data);
    setupProductData();
  });
}

function setupProductFile(filePath) {
  const filename = filePath.split('/').pop();
  const contentPath = './e2e/playwright/data/products/' + filename;

  try {
    fs.writeFileSync(contentPath, JSON.stringify({
      products: []
    }), 'utf-8');
    console.log('Created:', filename);
  } catch (error) {
    console.log('Error creating:', filename);
  }
}

// Setup all files and directories
setupProductData();

