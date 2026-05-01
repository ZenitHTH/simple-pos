import { browser, $, $$, expect } from '@wdio/globals';

describe('Vibe POS: Pure UI E2E (WebdriverIO)', () => {
  
  before(async () => {
    console.log("Environment Setup: Tauri WebdriverIO (Pure UI Mode)");
    // Initial pause to allow Tauri to fully load the webview
    await browser.pause(5000);
  });

  it('Step 1: Initializing Database & Welcome', async () => {
    const heading = await $('h1');
    await heading.waitForExist({ timeout: 30000 });
    const text = await heading.getText();
    
    if (text.includes('Welcome') || text.includes('Setup')) {
        const startBtn = await $('button*=Start');
        await startBtn.click();
        await browser.pause(1000);
        
        const inputs = await $$('input[type="password"]');
        if (inputs.length > 0) {
            await inputs[0].setValue('Runner01');
            await inputs[1].setValue('Runner01');
            await browser.keys('Enter');
            await browser.pause(2000);
        }
        
        const finishBtn = await $('button*=Finish');
        if (await finishBtn.isExisting()) {
             await finishBtn.click();
        } else {
             const completeBtn = await $('button*=Complete');
             if (await completeBtn.isExisting()) await completeBtn.click();
        }
    } else if (text.includes('Login')) {
        const input = await $('input[type="password"]');
        await input.setValue('Runner01');
        await browser.keys('Enter');
    }
    
    // Verify successful login by checking for the Management button
    const managementBtn = await $('button*=Management');
    await managementBtn.waitForExist({ timeout: 15000, timeoutMsg: 'Expected to reach Main Page' });
    expect(await managementBtn.isExisting()).toBeTruthy();
  });

  it('Step 2: Creating Category "Beverages"', async () => {
    // Navigate to Categories via UI
    const managementBtn = await $('button*=Management');
    await managementBtn.click();
    await browser.pause(1000);
    
    const catLink = await $('*=Categories');
    await catLink.click();
    await browser.pause(2000);

    const newCatBtn = await $('button*=New Category');
    await newCatBtn.waitForExist();
    await newCatBtn.click();

    const nameInput = await $('input[placeholder*="Category"]');
    await nameInput.setValue('Beverages');
    await browser.keys('Enter');

    // Wait for the UI to update and show the new category
    const categoryRow = await $('*=Beverages');
    await categoryRow.waitForExist({ timeout: 15000, timeoutMsg: 'Expected Beverages category to appear in the list' });
    expect(await categoryRow.isExisting()).toBeTruthy();
  });

  it('Step 3: Creating Product "Espresso"', async () => {
    // Navigate to Product Management via UI
    // If we are still in Management, just click the link
    const prodLink = await $('*=Product Management');
    if (await prodLink.isExisting()) {
        await prodLink.click();
    } else {
        const managementBtn = await $('button*=Management');
        await managementBtn.click();
        await browser.pause(1000);
        await prodLink.click();
    }
    await browser.pause(2000);

    const newProdBtn = await $('button*=New Product');
    await newProdBtn.waitForExist();
    await newProdBtn.click();

    const titleInput = await $('#product-title');
    await titleInput.setValue('Espresso');
    
    const priceInput = await $('#product-price');
    await priceInput.setValue('5000'); // Assuming satang input
    
    await browser.keys('Enter');

    // Wait for the product to appear in the UI list
    const productRow = await $('*=Espresso');
    await productRow.waitForExist({ timeout: 15000, timeoutMsg: 'Expected Espresso to appear in the list' });
    expect(await productRow.isExisting()).toBeTruthy();
  });

  it('Step 4: Performing Sale', async () => {
    // Navigate to Main Page via UI
    const mainPageBtn = await $('*=Main Page');
    await mainPageBtn.click();
    await browser.pause(2000);

    // Click the product card
    const espressoCard = await $('.tuner-card*=Espresso');
    await espressoCard.waitForExist({ timeout: 15000 });
    await espressoCard.click();

    const checkoutBtn = await $('button*=CHECKOUT');
    await checkoutBtn.click();

    // Select Cash
    const cashBtn = await $('button.bg-primary\\/10');
    await cashBtn.click();

    const confirmBtn = await $('button*=Confirm');
    await confirmBtn.click();

    // Verify success UI (e.g., checkout modal closes, or toast appears)
    // We wait for the checkout modal to disappear by waiting for Confirm button to go away
    await confirmBtn.waitForExist({ timeout: 15000, reverse: true });
  });

  it('Step 5: Final Truth Verification (History)', async () => {
    // Navigate to History via UI
    const historyBtn = await $('*=History');
    if (await historyBtn.isExisting()) {
        await historyBtn.click();
    } else {
        const mainPageBtn = await $('*=Main Page');
        await mainPageBtn.click();
        await browser.pause(1000);
        await historyBtn.click();
    }
    await browser.pause(2000);

    // Verify the receipt is in the history list and has the correct total
    // Assuming the history list shows "50.00" for 5000 satang
    const receiptTotal = await $('*=50.00'); 
    await receiptTotal.waitForExist({ timeout: 15000, timeoutMsg: 'Expected receipt with 50.00 to appear in history' });
    expect(await receiptTotal.isExisting()).toBeTruthy();
  });
});
