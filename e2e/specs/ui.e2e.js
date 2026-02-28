describe('Simple POS UI', () => {
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

    it('should create a test product in management page', async () => {
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
        await clickElement(newProductBtn);

        // Fill out modal
        const titleInput = await $('//div[label[contains(text(), "Title")]]/input');
        await titleInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(titleInput, "Xbox Controller");

        const priceInput = await $('//div[label[contains(text(), "Price")]]/input');
        await setInputValue(priceInput, "15000");

        // Click Save Product
        const saveProductBtn = await $('button[type="submit"]');
        await clickElement(saveProductBtn);

        // Wait for it to appear in table (modal closes)
        const row = await $('//table//td[contains(., "Xbox Controller")]');
        await row.waitForExist({ timeout: 10000 });

        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        // Click Main Page to go back
        const mainPageLink = await $('//a[.//span[contains(text(),"Main Page")]]');
        await mainPageLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(mainPageLink);

        // Wait for grid to render
        await browser.pause(1000);
    });

    it('should add a product to the cart', async () => {
        // Wait for products to load and grid to appear
        const firstProduct = await $('//div[contains(@class, "bg-card") and contains(@class, "group")][.//h3]');
        await firstProduct.waitForExist({ timeout: 15000 });

        // Get product name for verification
        const productNameElement = await firstProduct.$('h3');
        const productName = await productNameElement.getText();

        // Add a short pause to ensure React has hydrated and attached the onClick to the parent div
        await browser.pause(1000);

        // Force a click on the root product card div using JS to bypass any overlay issues
        await browser.execute((el) => {
            el.scrollIntoView({ block: 'center' });
            el.click();
        }, firstProduct);

        // Verify item appeared in cart
        // We'll wait up to 10s for the item to be mapped to the DOM.
        const cartItem = await $('div.bg-background.border-border.group');
        await cartItem.waitForExist({ timeout: 10000 });

        // CartItem name is rendered in h4
        const cartItemName = await cartItem.$('h4').getText();
        expect(cartItemName).toBe(productName);
    });

    it('should update quantity', async () => {
        const cartItem = await $('div.bg-background.border-border.group');

        // Find quantity display
        const quantitySpan = await cartItem.$('span.w-8.text-center');
        let quantity = await browser.execute((elem) => elem.textContent, quantitySpan);
        expect(quantity).toBe('1');

        // Click plus button
        const controlsDiv = await cartItem.$('div.bg-card.border-border');
        const buttons = await controlsDiv.$$('button');
        const plusButton = buttons[1]; // Index 1 is the plus button

        await clickElement(plusButton);

        // Verify quantity increased
        // Small pause to allow rerender
        await browser.pause(500);
        quantity = await browser.execute((elem) => elem.textContent, quantitySpan);
        expect(quantity).toBe('2');
    });

    it('should checkout and complete payment', async () => {
        // Check if mobile cart toggle exists and is visible (hamburger or cart icon)
        // In POSHeader, there is a button with text "Cart"
        const cartToggle = await $('//button[contains(., "Cart")]');
        if (await cartToggle.isExisting() && await cartToggle.isDisplayed()) {
            await clickElement(cartToggle);
            await browser.pause(500); // wait for drawer animation
        }

        // Find checkout button in cart summary
        // Since there's a desktop cart and a mobile drawer cart, we must click the truly visible one.
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

        // Click the first quick amount suggestion button
        // Need to be careful to find a button within the cash input section
        const quickAmounts = await $$('button.bg-primary\\/10');
        if (quickAmounts.length > 0) {
            await clickElement(quickAmounts[0]);
        }

        // Click confirm payment
        const confirmBtn = await $('//button[contains(., "Confirm Payment")]');
        await confirmBtn.waitForExist({ timeout: 5000 });

        // Small delay to allow 'isValid' logic to recalculate based on the click
        await browser.pause(500);
        await clickElement(confirmBtn);

        // Let's verify cart item is gone (wait for 0 elements)
        await browser.waitUntil(async () => {
            const items = await $$('div.bg-background.border-border.group');
            return items.length === 0;
        }, { timeout: 10000, timeoutMsg: 'Cart did not empty after payment' });
    });
});
