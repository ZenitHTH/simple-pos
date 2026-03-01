describe('Simple POS Stress Tests', () => {
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

    it('should bulk create 10 products', async () => {
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

        for (let i = 1; i <= 10; i++) {
            await clickElement(newProductBtn);
            
            const titleInput = await $('//label[contains(text(), "Title")]/following-sibling::input');
            await titleInput.waitForDisplayed({ timeout: 5000 });
            await setInputValue(titleInput, `Stress Product ${i}`);

            const priceInput = await $('//label[contains(text(), "Price")]/following-sibling::input');
            await setInputValue(priceInput, `${i * 10}`);

            const saveProductBtn = await $('//button[contains(., "Save")]');
            await clickElement(saveProductBtn);

            const row = await $(`//table//td[contains(., "Stress Product ${i}")]`);
            await row.waitForExist({ timeout: 10000 });
        }

        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mainPageLink = await $('//a[.//span[contains(text(),"Main Page")]]');
        await mainPageLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(mainPageLink);
        await browser.pause(2000);
    });

    it('should rapidly add products to cart', async () => {
        const productNodes = await $$('//div[contains(@class, "group")][.//h3[contains(text(), "Stress Product")]]');
        const count = Math.min(productNodes.length, 10);
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await browser.execute((el) => {
                if (el) {
                    el.scrollIntoView({ block: 'center' });
                    el.click();
                }
            }, productNodes[i]);
            await browser.pause(100);
        }

        await browser.pause(2000);
    });

    it('should rapidly change quantity 20 times', async () => {
        const plusButton = await $('//button[contains(., "+") or @aria-label="Increase" or .//*[local-name()="svg" and @class="lucide lucide-plus"]]');
        if (await plusButton.isExisting()) {
            for (let i = 0; i < 20; i++) {
                await clickElement(plusButton);
            }
            await browser.pause(1000);
        }
    });

    it('should checkout under load', async () => {
        const cartToggle = await $('//button[contains(., "Cart")]');
        if (await cartToggle.isExisting() && await cartToggle.isDisplayed()) {
            await clickElement(cartToggle);
            await browser.pause(500);
        }

        const checkoutBtn = await $('//button[contains(., "Checkout Now")]');
        if (await checkoutBtn.isExisting()) {
            await clickElement(checkoutBtn);
            await browser.pause(1000);

            const quickAmounts = await $$('//button[contains(@class, "bg-primary")]');
            if (quickAmounts.length > 0) {
                await clickElement(quickAmounts[quickAmounts.length - 1]);
            }

            const confirmBtn = await $('//button[contains(., "Confirm Payment")]');
            await confirmBtn.waitForExist({ timeout: 5000 });
            await browser.pause(1000);
            await clickElement(confirmBtn);

            await browser.pause(3000);
        }
    });
});
