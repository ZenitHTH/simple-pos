describe('Simple POS UI Flow', () => {
    const DB_PASSWORD = 'Runner01';

    const clickElement = async (el) => {
        await browser.execute((element) => { if (element) element.click(); }, el);
    };

    const setInputValue = async (el, value) => {
        await browser.execute((element, val) => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, val);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }, el, value);
    };

    it('should complete the setup or login flow', async () => {
        const h1 = await $('h1');
        await h1.waitForExist({ timeout: 30000 });
        const titleText = await h1.getText();

        if (titleText.includes('Welcome')) {
            const startSetupBtn = await $('button.btn-hero');
            if (await startSetupBtn.isExisting()) await clickElement(startSetupBtn);

            const passwordInput = await $('input[placeholder="Enter a strong password"]');
            await passwordInput.waitForExist({ timeout: 5000 });
            await setInputValue(passwordInput, DB_PASSWORD);

            const confirmInput = await $('input[placeholder="Repeat your password"]');
            await setInputValue(confirmInput, DB_PASSWORD);

            const nextButton = await $('button[type="submit"]');
            await browser.pause(500);
            await clickElement(nextButton);

            const finishSetupBtn = await $('//button[contains(., "Finish Setup")]');
            await finishSetupBtn.waitForExist({ timeout: 5000 });
            await clickElement(finishSetupBtn);
            await finishSetupBtn.waitForExist({ timeout: 5000, reverse: true });
        } else if (titleText.includes('Login')) {
            const passwordInput = await $('input[placeholder="Enter password"]');
            await passwordInput.waitForExist({ timeout: 5000 });
            await setInputValue(passwordInput, DB_PASSWORD);

            const loginButton = await $('button[type="submit"]');
            await clickElement(loginButton);
            await loginButton.waitForExist({ timeout: 5000, reverse: true });
        }
        await browser.pause(1000);
    });

    it('should create a test product in management page', async () => {
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });
        await clickElement(mgmtGroup);
        await browser.pause(500);

        const prodMgmtLink = await $('//a[.//span[contains(text(),"Product Management")]]');
        await prodMgmtLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(prodMgmtLink);
        
        const newProductBtn = await $('//button[contains(., "New Product")]');
        await newProductBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newProductBtn);

        const titleInput = await $('//label[contains(text(), "Title")]/following-sibling::input');
        await titleInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(titleInput, "Xbox Controller");

        const priceInput = await $('//label[contains(text(), "Price")]/following-sibling::input');
        await setInputValue(priceInput, "15000");

        const saveProductBtn = await $('//button[contains(., "Save Product")]');
        await clickElement(saveProductBtn);

        const row = await $('//table//td[contains(., "Xbox Controller")]');
        await row.waitForExist({ timeout: 10000 });

        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mainPageLink = await $('//a[.//span[contains(text(),"Main Page")]]');
        await mainPageLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(mainPageLink);
        await browser.pause(1000);
    });

    it('should add a product to the cart', async () => {
        const firstProduct = await $('//div[contains(@class, "group")][.//h3]');
        await firstProduct.waitForExist({ timeout: 15000 });
        const productName = await firstProduct.$('h3').getText();

        await browser.pause(1000);
        await browser.execute((el) => {
            el.scrollIntoView({ block: 'center' });
            el.click();
        }, firstProduct);

        const flexColDivs = await $$('//div[contains(@class, "flex-col")]');
        await browser.waitUntil(async () => {
            for (const d of flexColDivs) {
                const text = await d.getText();
                if (text.includes(productName)) return true;
            }
            return false;
        }, { timeout: 10000 });
    });

    it('should update quantity', async () => {
        // Just click plus button of first cart item
        const plusButton = await $('//button[contains(., "+") or @aria-label="Increase" or .//*[local-name()="svg" and @class="lucide lucide-plus"]]');
        if (await plusButton.isExisting()) {
            await clickElement(plusButton);
            await browser.pause(500);
        }
    });

    it('should checkout and complete payment', async () => {
        const cartToggle = await $('//button[contains(., "Cart")]');
        if (await cartToggle.isExisting() && await cartToggle.isDisplayed()) {
            await clickElement(cartToggle);
            await browser.pause(500);
        }

        const checkoutBtn = await $('//button[contains(., "Checkout Now")]');
        await checkoutBtn.waitForExist({ timeout: 5000 });
        await clickElement(checkoutBtn);
        await browser.pause(1000);

        const quickAmounts = await $$('//button[contains(@class, "bg-primary")]');
        if (quickAmounts.length > 0) {
            await clickElement(quickAmounts[quickAmounts.length - 1]);
        }

        const confirmBtn = await $('//button[contains(., "Confirm Payment")]');
        await confirmBtn.waitForExist({ timeout: 5000 });
        await browser.pause(500);
        await clickElement(confirmBtn);

        await browser.pause(2000);
    });
});
