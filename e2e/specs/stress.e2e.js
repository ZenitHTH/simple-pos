describe('Simple POS Stress Tests', () => {
    // Helper function to workaround Tauri WebDriver click issues on Linux
    const clickElement = async (el) => {
        await browser.execute((element) => {
            element.click();
        }, el);
    };

    // Helper function to workaround Tauri WebDriver setValue issues on Linux with React
    const setInputValue = async (el, value) => {
        await browser.execute((element, val) => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, val);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }, el, value);
    };

    it('should complete the setup or login flow', async () => {
        // Wait for the main title to appear to determine which screen we are on
        const h1 = await $('h1');
        await h1.waitForExist({ timeout: 30000 });
        const titleText = await h1.getText();

        if (titleText.includes('Welcome')) {
            // Welcome Screen
            const startSetupBtn = await $('button.btn-hero');
            await clickElement(startSetupBtn);

            // Password Setup Screen
            const passwordInput = await $('input[placeholder="Enter a strong password"]');
            await passwordInput.waitForExist({ timeout: 5000 });
            await setInputValue(passwordInput, 'Runner01');

            const confirmInput = await $('input[placeholder="Repeat your password"]');
            await setInputValue(confirmInput, 'Runner01');

            const nextButton = await $('button[type="submit"]');
            await browser.pause(500);
            await clickElement(nextButton);

            // Settings Setup Screen
            const finishSetupBtn = await $('xpath=//button[contains(., "Finish Setup")]');
            await finishSetupBtn.waitForExist({ timeout: 5000 });
            await clickElement(finishSetupBtn);
            // Wait for the Settings Setup to transition out
            await finishSetupBtn.waitForExist({ timeout: 5000, reverse: true });
        } else if (titleText.includes('Login')) {
            // Login Screen
            const passwordInput = await $('input[placeholder="Enter password"]');
            await passwordInput.waitForExist({ timeout: 5000 });
            await setInputValue(passwordInput, 'Runner01');

            const loginButton = await $('button[type="submit"]');
            await clickElement(loginButton);
            // Wait for login to transition out
            await loginButton.waitForExist({ timeout: 5000, reverse: true });
        }

        // Small pause to let POS screen load
        await browser.pause(1000);
    });

    it('should bulk create 20 products', async () => {
        // Find hamburger and click if displayed
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500); // wait for animation
        }

        // Click "Management" to expand group
        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });
        await clickElement(mgmtGroup);
        await browser.pause(500);

        // Click "Product Management"
        const prodMgmtLink = await $('//a[.//span[contains(text(),"Product Management")]]');
        await prodMgmtLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(prodMgmtLink);

        // Wait for Manage Page to load and "New Product" button to appear
        const newProductBtn = await $('//button[.//span[text()="New Product"]]');
        await newProductBtn.waitForDisplayed({ timeout: 10000 });

        for (let i = 1; i <= 20; i++) {
            await clickElement(newProductBtn);

            // Fill out modal
            const titleInput = await $('//div[label[contains(text(), "Title")]]/input');
            await titleInput.waitForDisplayed({ timeout: 5000 });
            await setInputValue(titleInput, `Stress Product ${i}`);

            const priceInput = await $('//div[label[contains(text(), "Price")]]/input');
            // Give prices from 10 to 200
            await setInputValue(priceInput, `${i * 10}`);

            // Click Save Product
            const saveProductBtn = await $('button[type="submit"]');
            await clickElement(saveProductBtn);

            // Wait for it to appear in table (modal closes)
            const row = await $(`//table//td[contains(., "Stress Product ${i}")]`);
            await row.waitForExist({ timeout: 10000 });
        }

        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        // Click Main Page to go back
        const mainPageLink = await $('//a[.//span[contains(text(),"Main Page")]]');
        await mainPageLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(mainPageLink);

        // Wait for grid to render
        await browser.pause(2000);
    });

    it('should rapidly add 20 products to cart', async () => {
        // Select all product cards that contain "Stress Product" in their h3
        const productNodes = await $$('//div[contains(@class, "bg-card") and contains(@class, "group")][.//h3[contains(text(), "Stress Product")]]');

        // Ensure we found at least 20, or handle if fewer
        const count = Math.min(productNodes.length, 20);
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await browser.execute((el) => {
                el.scrollIntoView({ block: 'center' });
                el.click();
            }, productNodes[i]);
            await browser.pause(100);
        }

        // Ensure cart has those items (wait for last one)
        const cartItems = await $$('div.bg-background.border-border.group');
        await browser.waitUntil(async () => {
            const items = await $$('div.bg-background.border-border.group');
            return items.length >= count;
        }, { timeout: 10000, timeoutMsg: 'Cart did not update fast enough' });
    });

    it('should rapidly change quantity 50 times', async () => {
        // Find the first cart item
        const firstCartItem = await $('div.bg-background.border-border.group');
        const quantitySpan = await firstCartItem.$('span.w-8.text-center');

        const controlsDiv = await firstCartItem.$('div.bg-card.border-border');
        const buttons = await controlsDiv.$$('button');
        const plusButton = buttons[1]; // Index 1 is the plus button

        for (let i = 0; i < 50; i++) {
            await clickElement(plusButton);
        }

        // Wait for a short moment so React can process the updates
        await browser.pause(1000);
        const quantityText = await browser.execute((elem) => elem.textContent, quantitySpan);
        // Initial was 1. Added 50 times -> 51.
        expect(quantityText).toBe('51');
    });

    it('should checkout under load', async () => {
        // Check if mobile cart toggle exists and is visible
        const cartToggle = await $('//button[contains(., "Cart")]');
        if (await cartToggle.isExisting() && await cartToggle.isDisplayed()) {
            await clickElement(cartToggle);
            await browser.pause(500);
        }

        // Find checkout button in cart summary
        const clickedCheckout = await browser.execute(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const checkoutBtns = btns.filter(b => b.textContent && b.textContent.includes('Checkout Now'));

            for (const btn of checkoutBtns) {
                const rect = btn.getBoundingClientRect();
                // Check if element is visible and in viewport
                if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    btn.click();
                    return true;
                }
            }
            return false;
        });

        if (!clickedCheckout) {
            throw new Error("Could not find a visible Checkout Now button to click");
        }
        await browser.pause(1000);

        // Wait for modal
        const cashInput = await $('input[id="cash-input"]');
        await cashInput.waitForExist({ timeout: 5000 });

        // The input is readonly, we need to click the numpad
        // Click '9' a few times to ensure a high amount
        const numpadBtns = await $$('//button[contains(@class, "bg-background") and contains(@class, "hover:bg-muted")]');
        // Find the button with text '9'
        let btn9 = null;
        for (const btn of numpadBtns) {
            if (await btn.getText() === '9') {
                btn9 = btn;
                break;
            }
        }

        if (btn9) {
            for (let i = 0; i < 7; i++) {
                await clickElement(btn9);
            }
        } else {
            // Fallback to quick amount if numpad '9' not found
            const quickAmounts = await $$('button.bg-primary\\/10');
            if (quickAmounts.length > 0) {
                await clickElement(quickAmounts[quickAmounts.length - 1]);
            }
        }

        // Click confirm payment
        const confirmBtn = await $('//button[contains(., "Confirm Payment")]');
        await confirmBtn.waitForExist({ timeout: 5000 });

        // Small delay to allow 'isValid' logic to recalculate based on the input
        await browser.pause(1000);
        await clickElement(confirmBtn);

        // Let's verify cart item is gone (wait for 0 elements), might take a bit under load to save DB and clear.
        await browser.waitUntil(async () => {
            const items = await $$('div.bg-background.border-border.group');
            return items.length === 0;
        }, { timeout: 15000, timeoutMsg: 'Cart did not empty after heavy checkout' });
    });
});
