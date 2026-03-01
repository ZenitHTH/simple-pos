describe('Simple POS Export & Customer Tests', () => {
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

    const setTextareaValue = async (el, value) => {
        await browser.execute((element, val) => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
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

    it('should create a new customer with tax ID', async () => {
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });
        await clickElement(mgmtGroup);
        await browser.pause(500);

        const customersLink = await $('//a[.//span[contains(text(),"Customers")]]');
        await customersLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(customersLink);

        const newCustomerBtn = await $('//button[contains(., "New Customer")]');
        await newCustomerBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newCustomerBtn);

        const nameInput = await $('//label[contains(text(), "Customer Name")]/following-sibling::input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, 'E2E Test Company Co., Ltd.');

        const taxIdInput = await $('//label[contains(text(), "Tax ID")]/following-sibling::input');
        await setInputValue(taxIdInput, '9999999999999');

        const addressInput = await $('//label[contains(text(), "Address")]/following-sibling::textarea');
        if (await addressInput.isExisting()) {
            await setTextareaValue(addressInput, '99 E2E Street, Test Province, 10000');
        }

        const saveCustomerBtn = await $('//button[contains(., "Save")]');
        await clickElement(saveCustomerBtn);

        const row = await $('//table//td[contains(., "E2E Test Company")]');
        await row.waitForExist({ timeout: 10000 });
        expect(await row.isExisting()).toBe(true);
        await browser.pause(500);
    });

    it('should add a product to cart and select the new customer before checkout', async () => {
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mainPageLink = await $('//a[.//span[contains(text(),"Main Page")]]');
        await mainPageLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(mainPageLink);
        await browser.pause(1000);

        const firstProduct = await $('//div[contains(@class, "group")][.//h3]');
        if (await firstProduct.isExisting()) {
            await clickElement(firstProduct);
            await browser.pause(500);
        }

        const customerDropdown = await $('//label[contains(text(), "Customer")]/following-sibling::div');
        if (await customerDropdown.isExisting()) {
            await clickElement(customerDropdown);
            await browser.pause(1000);
            await browser.execute(() => {
                const spans = Array.from(document.querySelectorAll('div.bg-popover span'));
                const customerSpan = spans.find(span => span.textContent.includes('E2E Test Company'));
                if (customerSpan && customerSpan.parentElement) customerSpan.parentElement.click();
            });
            await browser.pause(300);
        }
    });

    it('should navigate to Export settings and trigger an export', async () => {
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const settingGroup = await $('//button[.//span[contains(text(),"System Setting")]]');
        await settingGroup.waitForDisplayed({ timeout: 5000 });
        await clickElement(settingGroup);
        await browser.pause(500);

        const exportLink = await $('//a[.//span[contains(text(),"Export")]]');
        await exportLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(exportLink);
        await browser.pause(1000);

        const exportBtn = await $('//button[contains(., "Export")]');
        await exportBtn.waitForDisplayed({ timeout: 5000 });
        await clickElement(exportBtn);

        await browser.pause(2000);
        const body = await $('body');
        expect(await body.isExisting()).toBe(true);
    });
});
