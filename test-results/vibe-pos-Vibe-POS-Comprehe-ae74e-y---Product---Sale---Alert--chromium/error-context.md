# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vibe-pos.spec.ts >> Vibe POS Comprehensive E2E >> Full POS Golden Path (Setup -> Category -> Product -> Sale -> Alert)
- Location: e2e/playwright/vibe-pos.spec.ts:38:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /New Product/i })

```

# Test source

```ts
  41  |   }
  42  | }
  43  | 
  44  | /**
  45  |  * Robustly connects to the Tauri application based on the platform.
  46  |  * Windows/macOS: connectOverCDP (Chromium)
  47  |  * Linux: launch via tauri-driver (WebKit)
  48  |  */
  49  | export async function connectToApp(browserType: any, port: number = 9223): Promise<any> {
  50  |   const isLinux = process.platform === 'linux';
  51  |   const baseUrl = `http://127.0.0.1:${port}`;
  52  | 
  53  |   if (isLinux) {
  54  |     logger.info(`Linux detected: Launching via tauri-driver to ${baseUrl}...`);
  55  |     // On Linux, we MUST use WebKit with tauri-driver
  56  |     const { webkit } = await import('@playwright/test');
  57  |     
  58  |     // Find the executable path. In our setup, it's consistent.
  59  |     const executablePath = 'src-tauri/target/debug/app';
  60  |     const tauriDriverPath = '/home/zenithth/.cargo/bin/tauri-driver';
  61  |     
  62  |     return await webkit.launch({
  63  |       executablePath: tauriDriverPath,
  64  |       args: ['--port', port.toString()],
  65  |       env: {
  66  |         ...process.env,
  67  |         TAURI_APPLICATION_PATH: executablePath,
  68  |       },
  69  |       ignoreDefaultArgs: true, // Crucial: tauri-driver only accepts specific flags
  70  |     });
  71  |   }
  72  | 
  73  |   logger.info(`Non-Linux detected: Connecting via CDP to ${baseUrl}...`);
  74  |   const cdpUrl = await getCDPUrl(baseUrl);
  75  |   return await browserType.connectOverCDP(cdpUrl, { timeout: 30000 });
  76  | }
  77  | 
  78  | /**
  79  |  * Finds the correct CDP URL, especially important for Linux/WebKit environments.
  80  |  */
  81  | export async function getCDPUrl(baseUrl: string = 'http://127.0.0.1:9223', retries: number = 5): Promise<string> {
  82  |   logger.info(`Discovering CDP URL from ${baseUrl} (Remaining retries: ${retries})...`);
  83  |   
  84  |   return new Promise((resolve) => {
  85  |     const req = http.get(`${baseUrl}/json`, (res) => {
  86  |       let data = '';
  87  |       res.on('data', (chunk) => { data += chunk; });
  88  |       res.on('end', () => {
  89  |         try {
  90  |           const targets = JSON.parse(data);
  91  |           if (Array.isArray(targets) && targets.length > 0) {
  92  |             // Prefer 'page' type, fallback to first target
  93  |             const target = targets.find((t: any) => t.type === 'page') || targets[0];
  94  |             if (target.webSocketDebuggerUrl) {
  95  |               logger.info(`Found WebSocket URL: ${target.webSocketDebuggerUrl}`);
  96  |               resolve(target.webSocketDebuggerUrl);
  97  |               return;
  98  |             }
  99  |           }
  100 |         } catch (e) {
  101 |           logger.warn("Failed to parse CDP JSON response");
  102 |         }
  103 |         resolve(baseUrl);
  104 |       });
  105 |     }).on('error', async (err) => {
  106 |       if (retries > 0) {
  107 |         logger.info(`CDP discovery failed (${err.message}), retrying...`);
  108 |         await new Promise(r => setTimeout(r, 2000));
  109 |         resolve(await getCDPUrl(baseUrl, retries - 1));
  110 |       } else {
  111 |         logger.warn(`CDP discovery failed: ${err.message}. Using base URL.`);
  112 |         resolve(baseUrl);
  113 |       }
  114 |     });
  115 |   });
  116 | }
  117 | 
  118 | /**
  119 |  * Sets an input value and ensures React handles the change event.
  120 |  */
  121 | export async function setInputValue(page: Page, selector: string, value: string) {
  122 |   const element = page.locator(selector);
  123 |   await element.waitFor({ state: 'visible', timeout: 10000 });
  124 |   
  125 |   // Playwright's fill() is usually smarter than WDIO's setValue
  126 |   await element.fill(value);
  127 |   
  128 |   // Wait a bit for React state updates
  129 |   await page.waitForTimeout(500);
  130 | }
  131 | 
  132 | /**
  133 |  * Clicks an element, ensuring it's in view and attached to the DOM.
  134 |  */
  135 | export async function clickElement(page: Page, selector: string | any) {
  136 |   const locator = typeof selector === 'string' ? page.locator(selector) : selector;
  137 |   
  138 |   try {
  139 |     // Wait for the element to be present in the DOM
  140 |     logger.info(`Waiting for element: ${typeof selector === 'string' ? selector : 'locator'}`);
> 141 |     await locator.waitFor({ state: 'attached', timeout: 30000 });
      |                   ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  142 |     
  143 |     // Wait a tiny bit for any animations or transitions to settle
  144 |     await page.waitForTimeout(500);
  145 |     
  146 |     await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {
  147 |         logger.info("Note: scrollIntoViewIfNeeded failed or timed out, proceeding anyway");
  148 |     });
  149 | 
  150 |     logger.info("Executing click...");
  151 |     await locator.click({ force: true });
  152 |   } catch (err) {
  153 |     logger.error(`Failed to click element: ${(err as Error).message}`);
  154 |     throw err;
  155 |   }
  156 | }
  157 | 
  158 | /**
  159 |  * Finds the main application page by checking titles.
  160 |  */
  161 | export async function getMainPage(browser: any) {
  162 |   // Wait a bit for all windows to open
  163 |   await new Promise(resolve => setTimeout(resolve, 5000));
  164 |   
  165 |   const contexts = browser.contexts();
  166 |   for (const context of contexts) {
  167 |     const pages = context.pages();
  168 |     for (const page of pages) {
  169 |       const title = await page.title();
  170 |       const url = page.url();
  171 |       
  172 |       logger.info(`Checking page: Title="${title}", URL="${url}"`);
  173 |       
  174 |       // The main app should be on port 3000 (dev) or have the correct title
  175 |       if ((title.includes('Simple POS') || url.includes('3000')) && !title.includes('Manual')) {
  176 |         return page;
  177 |       }
  178 |     }
  179 |   }
  180 |   
  181 |   return contexts[0].pages()[0];
  182 | }
  183 | 
  184 | /**
  185 |  * Performs the initial setup or login flow.
  186 |  */
  187 | export async function performLogin(page: Page) {
  188 |   // Ensure viewport is large enough to see all elements
  189 |   await page.setViewportSize({ width: 1280, height: 800 });
  190 | 
  191 |   // Wait for the app to load. We look for a heading that represents the current state.
  192 |   logger.info("Waiting for any H1 heading to appear...");
  193 |   const heading = page.locator('h1').first();
  194 |   await heading.waitFor({ state: 'attached', timeout: 60000 });
  195 |   
  196 |   let titleText = await heading.innerText();
  197 |   logger.info(`Current screen title: "${titleText}"`);
  198 | 
  199 |   // Check if we are already at the POS (the main app screen)
  200 |   // We check for "History" or "Cart" buttons which are unique to the POS
  201 |   const historyBtn = page.getByRole('button', { name: /History/i });
  202 |   const cartBtn = page.getByRole('button', { name: /Cart/i });
  203 |   
  204 |   if (await historyBtn.isVisible() || await cartBtn.isVisible()) {
  205 |     logger.info("Already at POS screen (History/Cart visible), skipping login/setup");
  206 |     return;
  207 |   }
  208 | 
  209 |   logger.info("Not at POS screen yet, proceeding with setup/login flow...");
  210 | 
  211 |   if (titleText.includes('Welcome') || titleText.includes('Simple POS') || titleText.includes('Setup')) {
  212 |     logger.info("Detected Welcome/Setup screen");
  213 |     
  214 |     // 1. Welcome Screen
  215 |     // Use a more robust locator and force click
  216 |     const startBtn = page.locator('button').filter({ hasText: /Start Setup/i }).first();
  217 |     try {
  218 |         await startBtn.waitFor({ state: 'visible', timeout: 10000 });
  219 |         logger.info("Clicking Start Setup...");
  220 |         await startBtn.click({ force: true });
  221 |         await page.waitForTimeout(2000);
  222 |     } catch (e) {
  223 |         logger.info("Start Setup button not visible, attempting direct click...");
  224 |         await startBtn.click({ force: true }).catch(() => logger.info("Direct click failed too"));
  225 |     }
  226 | 
  227 |     // 2. Password Setup Screen
  228 |     const passwordInput = page.locator('input[placeholder="Enter a strong password"]');
  229 |     try {
  230 |         logger.info("Waiting for Password screen...");
  231 |         await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
  232 |         logger.info("Entering password...");
  233 |         await passwordInput.fill('Runner01');
  234 |         await page.locator('input[placeholder="Repeat your password"]').fill('Runner01');
  235 | 
  236 |         const nextBtn = page.getByRole('button', { name: /Next/i });
  237 |         logger.info("Clicking Next...");
  238 |         await nextBtn.click();
  239 |         await page.waitForTimeout(3000);
  240 |     } catch (e) {
  241 |         logger.info("Password screen not found or already passed");
```