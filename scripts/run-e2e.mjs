import { spawn, spawnSync } from 'child_process';
import os from 'os';

const isWindows = os.platform() === 'win32';

// 1. Build the Tauri app in debug mode
console.log('Building Tauri app...');
spawnSync('npm', ['run', 'tauri', 'build', '--', '--debug', '--no-bundle'], { stdio: 'inherit', shell: true });

// 2. Set up environment variables for remote debugging
const env = { ...process.env };
if (isWindows) {
  env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--remote-debugging-port=9223';
} else {
  env.WEBKIT_INSPECTOR_SERVER = '127.0.0.1:9223';
}

// 3. Launch Tauri app
console.log('Launching Tauri app...');
const appPath = `./src-tauri/target/debug/app${isWindows ? '.exe' : ''}`;
const tauriProcess = spawn(appPath, [], { env, stdio: 'inherit' });

// 4. Wait a moment for the app to start
setTimeout(() => {
  // 5. Run Playwright
  console.log('Running Playwright...');
  const playwrightProcess = spawn('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });
  
  playwrightProcess.on('close', (code) => {
    tauriProcess.kill();
    process.exit(code);
  });
}, 5000); // Increased timeout to 5s to be safe
