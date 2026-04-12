# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> Simple POS App Launch
- Location: e2e\playwright\example.spec.ts:4:5

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected: "Simple POS"
Received: "127.0.0.1"
Timeout:  5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    7 × unexpected value "127.0.0.1"
    - waiting for" http://127.0.0.1:3000/" navigation to finish...

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "Hmmm… can't reach this page" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: 127.0.0.1
      - text: refused to connect.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: •Checking the connection
        - listitem [ref=e14]:
          - text: •
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - button "Refresh" [ref=e19] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect, chromium } from '@playwright/test';
  2  | import { getMainPage } from './helpers';
  3  | 
  4  | test('Simple POS App Launch', async () => {
  5  |   // Connect to the Tauri app's remote debugging port
  6  |   const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
  7  |   
  8  |   // Get the main application page
  9  |   const page = await getMainPage(browser);
  10 |   
  11 |   // Verify the app title
> 12 |   await expect(page).toHaveTitle('Simple POS');
     |                      ^ Error: expect(page).toHaveTitle(expected) failed
  13 |   
  14 |   await browser.close();
  15 | });
  16 | 
```