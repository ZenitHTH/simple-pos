# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced-management.spec.ts >> Advanced Management (Priority C) >> TEST-C1: Material Tagging & Filtering
- Location: e2e/playwright/advanced-management.spec.ts:14:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1   | import { test, expect, chromium } from '@playwright/test';
  2   | import { performLogin, navigateTo, getMainPage, clickElement } from './helpers';
  3   | 
  4   | test.describe('Advanced Management (Priority C)', () => {
  5   |   let browser: any;
  6   |   let page: any;
  7   | 
  8   |   test.beforeAll(async () => {
> 9   |     browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
      |                              ^ Error: browserType.connectOverCDP: socket hang up
  10  |     page = await getMainPage(browser);
  11  |     await performLogin(page);
  12  |   });
  13  | 
  14  |   test('TEST-C1: Material Tagging & Filtering', async () => {
  15  |     // 1. Navigate to Material Management (Inventory -> Raw Materials tab)
  16  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  17  |     
  18  |     // Switch to Raw Materials tab
  19  |     const materialsTab = page.getByRole('button', { name: /Raw Materials/i });
  20  |     await clickElement(page, materialsTab);
  21  | 
  22  |     // 2. Create Material with Tags
  23  |     await clickElement(page, page.getByRole('button', { name: /New Material/i }));
  24  |     await page.getByLabel('Name').fill('Organic Coffee');
  25  |     await page.getByLabel('Volume').fill('500');
  26  |     await page.getByLabel('Quantity').fill('10');
  27  |     
  28  |     // Select Type/Unit (Custom Select)
  29  |     const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
  30  |     await clickElement(page, typeTrigger);
  31  |     await clickElement(page, page.locator('div.bg-popover').getByText('Ingredient', { exact: true }));
  32  | 
  33  |     // Add Tags
  34  |     const tagInput = page.getByPlaceholder(/Add a tag/i);
  35  |     await tagInput.fill('Organic');
  36  |     await page.keyboard.press('Enter');
  37  |     await tagInput.fill('Dark Roast');
  38  |     await page.keyboard.press('Enter');
  39  | 
  40  |     await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
  41  | 
  42  |     // 3. Verify Filtering
  43  |     // Assuming tags are shown as pill buttons in a filter area
  44  |     const organicTagFilter = page.locator('.pill-group button').filter({ hasText: 'Organic' });
  45  |     await clickElement(page, organicTagFilter);
  46  |     
  47  |     // Table should contain 'Organic Coffee'
  48  |     await expect(page.locator('table')).toContainText('Organic Coffee');
  49  |     
  50  |     // Deselect Organic, select something else (if exists)
  51  |     await clickElement(page, organicTagFilter);
  52  |   });
  53  | 
  54  |   test('TEST-C3: Customer Management & Protection', async () => {
  55  |     // 1. Create Customer
  56  |     await navigateTo(page, 'Management', 'Customers');
  57  |     await clickElement(page, page.getByRole('button', { name: /New Customer/i }));
  58  |     
  59  |     await page.getByLabel(/Name/i).fill('Alice Tester');
  60  |     await page.getByLabel(/Tax ID/i).fill('1234567890123');
  61  |     await clickElement(page, page.getByRole('button', { name: /Save Customer/i }));
  62  |     
  63  |     await expect(page.locator('table')).toContainText('Alice Tester');
  64  | 
  65  |     // 2. Link to Sale
  66  |     await navigateTo(page, null, 'Main Page');
  67  |     
  68  |     // Add any product to cart
  69  |     const productCard = page.locator('.tuner-card').first();
  70  |     await clickElement(page, productCard);
  71  |     
  72  |     // Open Customer Selector
  73  |     await clickElement(page, page.getByRole('button', { name: /Add Customer/i }));
  74  |     await page.getByPlaceholder(/Search customers/i).fill('Alice Tester');
  75  |     await clickElement(page, page.getByText('Alice Tester'));
  76  |     
  77  |     // Complete Sale
  78  |     await clickElement(page, page.getByRole('button', { name: /Charge/i }));
  79  |     await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
  80  | 
  81  |     // 3. Verify Deletion Block
  82  |     await navigateTo(page, 'Management', 'Customers');
  83  |     
  84  |     // Click Delete for Alice
  85  |     const aliceRow = page.locator('tr').filter({ hasText: 'Alice Tester' });
  86  |     const deleteBtn = aliceRow.getByRole('button', { name: /Delete/i });
  87  |     await clickElement(page, deleteBtn);
  88  |     
  89  |     // Confirm in modal
  90  |     await clickElement(page, page.getByRole('button', { name: /OK|Confirm|Delete/i }));
  91  | 
  92  |     // Verify error alert shows dependency message
  93  |     const alert = page.getByRole('alertdialog');
  94  |     await expect(alert).toBeVisible();
  95  |     await expect(alert).toContainText(/receipt/i);
  96  |     
  97  |     await clickElement(page, alert.getByRole('button', { name: /OK/i }));
  98  |   });
  99  | });
  100 | 
```