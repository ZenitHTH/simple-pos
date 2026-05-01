import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tauriDriver;

export const config = {
  hostname: '127.0.0.1',
  port: 4444,
  path: '/',
  automationProtocol: 'webdriver',
  specs: ['./test/specs/**/*.ts'],
  maxInstances: 1,
  capabilities: [{
    maxInstances: 1,
    browserName: 'wry',
    'wdio:enforceWebDriverClassic': true,
    'tauri:options': {
      application: path.resolve(__dirname, '../../src-tauri/target/debug/app'),
    },
  }],
  reporters: ['spec'],
  framework: 'mocha',
  mochaOpts: { 
    ui: 'bdd',
    timeout: 180000 
  },
  
  beforeSession: async () => {
    // Start tauri-driver
    // Assumes tauri-driver is installed via `cargo install tauri-driver` and is in PATH
    // Additionally, passing WEBKIT_DISABLE_DMABUF_RENDERER=1 is required for Wayland/Fedora environments
    tauriDriver = spawn('tauri-driver', ['--port', '4444'], { 
      stdio: 'inherit',
      env: {
        ...process.env,
        WEBKIT_DISABLE_DMABUF_RENDERER: '1',
        GDK_BACKEND: 'x11'
      }
    });
    // Give tauri-driver a moment to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  },
  
  afterSession: () => {
    if (tauriDriver) {
      tauriDriver.kill();
    }
  },
};
