# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced-management.spec.ts >> Advanced Management (Priority C) >> TEST-C1: Material Tagging & Filtering
- Location: e2e/playwright/advanced-management.spec.ts:35:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('h1').first()

```

# Test source

```ts
  33  |       const data = await response.json();
  34  |       if (data && data[0] && data[0].webSocketDebuggerUrl) {
  35  |         return data[0].webSocketDebuggerUrl;
  36  |       }
  37  |     } catch (e) {
  38  |       await new Promise(r => setTimeout(r, 1000));
  39  |     }
  40  |   }
  41  |   throw new Error("CDP URL not found");
  42  | }
  43  | 
  44  | export async function getMainPage(browser: any) {
  45  |   await new Promise(resolve => setTimeout(resolve, 2000));
  46  |   
  47  |   const contexts = browser.contexts();
  48  |   let context;
  49  |   if (contexts.length === 0) {
  50  |     context = await browser.newContext();
  51  |   } else {
  52  |     context = contexts[0];
  53  |   }
  54  |   
  55  |   const pages = context.pages();
  56  |   let page = pages.length === 0 ? await context.newPage() : pages[0];
  57  |   
  58  |   // IF NOT TAURI, MUST GOTO DEV SERVER
  59  |   if (!cachedSetup?.isTauri) {
  60  |     logger.info("Fallback detected: Navigating to http://127.0.0.1:3000");
  61  |     await page.goto('http://127.0.0.1:3000');
  62  |   }
  63  |   
  64  |   return page;
  65  | }
  66  | 
  67  | export async function clickElement(page: Page, selector: string | Locator) {
  68  |   const locator = typeof selector === 'string' ? page.locator(selector) : selector;
  69  |   try {
  70  |     await locator.waitFor({ state: 'attached', timeout: 10000 });
  71  |     await page.waitForTimeout(300);
  72  |     await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  73  |     await locator.click({ timeout: 5000 });
  74  |   } catch (e) {
  75  |     logger.warn(`Standard click failed for ${selector.toString()}, trying forced dispatch...`);
  76  |     await locator.dispatchEvent('click').catch((err) => {
  77  |         console.error(`Failed to click element: ${(err as Error).message}`);
  78  |         throw err;
  79  |     });
  80  |   }
  81  | }
  82  | 
  83  | export async function navigateTo(page: Page, group: string | null, name: string) {
  84  |   const urlMap: any = {
  85  |     'Main Page': '/',
  86  |     'Product Management': '/manage',
  87  |     'Categories': '/manage/categories',
  88  |     'Inventory & Stock': '/manage/stock',
  89  |   };
  90  | 
  91  |   logger.info(`Navigating to ${name}...`);
  92  |   
  93  |   // Method 1: Router Backdoor (Fastest & Most Stable)
  94  |   const navigated = await page.evaluate(async (path) => {
  95  |     if ((window as any).router) {
  96  |       (window as any).router.push(path);
  97  |       return true;
  98  |     }
  99  |     return false;
  100 |   }, urlMap[name]);
  101 | 
  102 |   if (navigated) {
  103 |     await page.waitForURL(`**${urlMap[name]}`, { timeout: 10000 });
  104 |     return;
  105 |   }
  106 | 
  107 |   // Method 2: UI Click
  108 |   if (group) await clickElement(page, page.getByRole('button', { name: group }));
  109 |   await clickElement(page, page.getByRole('link', { name: name, exact: true }));
  110 |   await page.waitForURL(`**${urlMap[name]}`, { timeout: 10000 });
  111 | }
  112 | 
  113 | export async function verifyDatabaseState(page: Page, check: (db: any) => void) {
  114 |   const db = await page.evaluate(async () => {
  115 |     if (!(window as any).settingsApi) return null;
  116 |     return await (window as any).settingsApi.getDbTruth();
  117 |   });
  118 |   if (!db) throw new Error("DB Truth Backdoor not available");
  119 |   return check(db);
  120 | }
  121 | 
  122 | export async function waitForAction(page: Page, actionName: string, timeout: number = 15000) {
  123 |     logger.info(`Waiting for action truth: "${actionName}"...`);
  124 |     await page.waitForFunction((name) => {
  125 |         const markers = (window as any).__TEST_MARKERS__ || [];
  126 |         return markers.some((m: any) => m.name === name);
  127 |     }, actionName, { timeout });
  128 | }
  129 | 
  130 | export async function performLogin(page: Page) {
  131 |   await page.setViewportSize({ width: 1280, height: 800 });
  132 |   const heading = page.locator('h1').first();
> 133 |   await heading.waitFor({ state: 'attached', timeout: 30000 });
      |                 ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  134 |   
  135 |   const text = await heading.innerText();
  136 |   if (text.includes('Welcome') || text.includes('Setup')) {
  137 |     await clickElement(page, page.getByText(/Start/i));
  138 |     await page.waitForTimeout(1000);
  139 |     
  140 |     // Password
  141 |     const inputs = page.locator('input[type="password"]');
  142 |     if (await inputs.count() > 0) {
  143 |         await inputs.nth(0).fill('Runner01');
  144 |         await inputs.nth(1).fill('Runner01');
  145 |         await page.keyboard.press('Enter');
  146 |         await page.waitForTimeout(2000);
  147 |     }
  148 |     
  149 |     // Finish
  150 |     await clickElement(page, page.getByText(/Finish|Complete/i));
  151 |   } else if (text.includes('Login')) {
  152 |     await page.locator('input[type="password"]').fill('Runner01');
  153 |     await page.keyboard.press('Enter');
  154 |   }
  155 |   
  156 |   await page.waitForTimeout(2000);
  157 | }
  158 | 
```