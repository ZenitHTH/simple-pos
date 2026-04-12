# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pos.spec.ts >> POS Full Workflow >> should create a category and a product, then complete a sale
- Location: e2e\playwright\pos.spec.ts:20:7

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('button').filter({ hasText: 'Management' }) to be visible

```

# Test source

```ts
  33  |   const contexts = browser.contexts();
  34  |   console.log(`Found ${contexts.length} contexts`);
  35  |   
  36  |   for (const context of contexts) {
  37  |     const pages = context.pages();
  38  |     console.log(`Context has ${pages.length} pages`);
  39  |     
  40  |     for (const page of pages) {
  41  |       const title = await page.title();
  42  |       const url = page.url();
  43  |       console.log(`Page title: "${title}", URL: "${url}"`);
  44  |       
  45  |       // The main app should be on port 3000 (dev) or have the correct title
  46  |       if ((title.includes('Simple POS') || url.includes('3000')) && !title.includes('Manual')) {
  47  |         console.log(`>>> Selected page: "${title}"`);
  48  |         return page;
  49  |       }
  50  |     }
  51  |   }
  52  |   
  53  |   // If we still haven't found it, look for ANY page that isn't the manual
  54  |   for (const context of contexts) {
  55  |     for (const page of context.pages()) {
  56  |       const title = await page.title();
  57  |       if (!title.includes('Manual')) {
  58  |         return page;
  59  |       }
  60  |     }
  61  |   }
  62  | 
  63  |   return contexts[0].pages()[0];
  64  | }
  65  | 
  66  | /**
  67  |  * Performs the initial setup or login flow.
  68  |  */
  69  | export async function performLogin(page: Page) {
  70  |   // Ensure viewport is large enough to see all elements
  71  |   await page.setViewportSize({ width: 1280, height: 800 });
  72  | 
  73  |   // Wait for the app to load. We look for a heading that represents the current state.
  74  |   // Use first() to avoid strict mode violations if multiple h1s exist during transition
  75  |   const heading = page.locator('h1').first();
  76  |   await heading.waitFor({ state: 'attached', timeout: 15000 });
  77  |   
  78  |   const titleText = await heading.innerText();
  79  | 
  80  |   if (titleText.includes('Welcome') || titleText.includes('Simple POS') || titleText.includes('Setup')) {
  81  |     // Check if we are on the Welcome Screen
  82  |     const startBtn = page.getByRole('button', { name: /Start Setup/i });
  83  |     if (await startBtn.isVisible()) {
  84  |       await startBtn.click();
  85  |       await page.waitForTimeout(500);
  86  |     }
  87  | 
  88  |     // Password Setup Screen
  89  |     const passwordInput = page.locator('input[placeholder="Enter a strong password"]');
  90  |     if (await passwordInput.isVisible()) {
  91  |         await passwordInput.fill('Runner01');
  92  |         await page.locator('input[placeholder="Repeat your password"]').fill('Runner01');
  93  |         await page.getByRole('button', { name: /Next/i }).click();
  94  |         await page.waitForTimeout(500);
  95  |     }
  96  | 
  97  |     // Settings Setup Screen
  98  |     const finishSetupBtn = page.getByRole('button', { name: /Finish Setup/i });
  99  |     if (await finishSetupBtn.isVisible()) {
  100 |         await finishSetupBtn.click({ force: true });
  101 |         // Wait for the transition to the POS
  102 |         await finishSetupBtn.waitFor({ state: 'hidden', timeout: 10000 });
  103 |     }
  104 |   } else if (titleText.includes('Login')) {
  105 |     // Login Screen
  106 |     await setInputValue(page, 'input[placeholder="Enter password"]', 'Runner01');
  107 |     const loginBtn = page.getByRole('button', { name: /Login/i });
  108 |     await loginBtn.click();
  109 |     
  110 |     // Wait for login to finish - we wait for the login button to disappear
  111 |     await loginBtn.waitFor({ state: 'hidden', timeout: 10000 });
  112 |   }
  113 | 
  114 |   // Final wait for the main POS screen (Product Grid)
  115 |   // Ensure any login/setup overlays are gone
  116 |   await page.waitForSelector('div.bg-black\\/60.backdrop-blur-sm', { state: 'hidden', timeout: 15000 }).catch(() => {});
  117 |   await page.waitForTimeout(1000);
  118 | }
  119 | 
  120 | /**
  121 |  * Navigates to a specific section using the sidebar.
  122 |  */
  123 | export async function navigateTo(page: Page, groupName: string | null, linkName: string) {
  124 |   // Check for mobile hamburger
  125 |   const hamburger = page.locator('button.text-muted.-ml-2');
  126 |   if (await hamburger.isVisible()) {
  127 |     await hamburger.click();
  128 |     await page.waitForTimeout(500);
  129 |   }
  130 | 
  131 |   if (groupName) {
  132 |     const group = page.getByRole('button').filter({ hasText: groupName });
> 133 |     await group.waitFor({ state: 'visible' });
      |                 ^ Error: locator.waitFor: Target page, context or browser has been closed
  134 |     
  135 |     // Check if expanded (this depends on your implementation, usually aria-expanded)
  136 |     // If we can't detect it easily, just click and wait
  137 |     await group.click();
  138 |     await page.waitForTimeout(500);
  139 |   }
  140 | 
  141 |   const link = page.locator('a').filter({ hasText: linkName });
  142 |   await link.waitFor({ state: 'visible' });
  143 |   await link.click();
  144 |   await page.waitForTimeout(500);
  145 | }
  146 | 
```