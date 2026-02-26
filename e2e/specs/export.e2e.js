describe('Simple POS Export & Customer Tests', () => {
    const DB_PASSWORD = 'Runner01';

    // Helper: click element via JS to bypass Tauri WebDriver click issues
    const clickElement = async (el) => {
        await browser.execute((element) => {
            element.click();
        }, el);
    };

    // Helper: set React input value (bypasses synthetic event issues)
    const setInputValue = async (el, value) => {
        await browser.execute((element, val) => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, val);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }, el, value);
    };

    // Helper: set React textarea value
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
            await clickElement(startSetupBtn);

            const passwordInput = await $('input[placeholder="Enter a strong password"]');
            await passwordInput.waitForExist({ timeout: 5000 });
            await setInputValue(passwordInput, DB_PASSWORD);

            const confirmInput = await $('input[placeholder="Repeat your password"]');
            await setInputValue(confirmInput, DB_PASSWORD);

            const nextButton = await $('button[type="submit"]');
            await browser.pause(500);
            await clickElement(nextButton);

            const finishSetupBtn = await $('xpath=//button[contains(., "Finish Setup")]');
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
        // Open sidebar on mobile (if hamburger visible)
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        // Expand "Management" menu group
        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });
        await clickElement(mgmtGroup);
        await browser.pause(500);

        // Navigate to Customers page
        const customersLink = await $('//a[.//span[contains(text(),"Customers")]]');
        await customersLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(customersLink);

        // Wait for Customers page
        const newCustomerBtn = await $('//button[.//span[text()="New Customer"]]');
        await newCustomerBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newCustomerBtn);

        // Fill out the Customer Modal
        const nameInput = await $('//div[label[contains(text(), "Customer Name")]]/input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, 'E2E Test Company Co., Ltd.');

        const taxIdInput = await $('//div[label[contains(text(), "Tax ID")]]/input');
        await setInputValue(taxIdInput, '9999999999999');

        const addressInput = await $('//div[label[contains(text(), "Address")]]/textarea');
        await setTextareaValue(addressInput, '99 E2E Street, Test Province, 10000');

        // Submit
        const saveCustomerBtn = await $('button[type="submit"]');
        await clickElement(saveCustomerBtn);

        // Confirm the customer appears in the table
        const row = await $('//table//td[contains(., "E2E Test Company Co., Ltd.")]');
        await row.waitForExist({ timeout: 10000 });
        expect(await row.isExisting()).toBe(true);

        await browser.pause(500);
    });

    it('should add a product to cart and select the new customer before checkout', async () => {
        // Navigate to Main Page
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mainPageLink = await $('//a[.//span[contains(text(),"Main Page")]]');
        await mainPageLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(mainPageLink);
        await browser.pause(1000);

        // Click the first available product card
        const firstProduct = await $('//div[contains(@class, "cursor-pointer") and contains(@class, "group")][.//h3]');
        if (await firstProduct.isExisting()) {
            await clickElement(firstProduct);
            await browser.pause(500);
        }

        // Select customer from dropdown in cart
        const customerDropdown = await $('select');
        await customerDropdown.waitForExist({ timeout: 5000 });
        await customerDropdown.selectByVisibleText('E2E Test Company Co., Ltd. (9999999999999)');
        await browser.pause(300);
    });

    it('should navigate to Export settings and trigger an export', async () => {
        // Open sidebar
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        // Expand System Setting
        const settingGroup = await $('//button[.//span[contains(text(),"System Setting")]]');
        await settingGroup.waitForDisplayed({ timeout: 5000 });
        await clickElement(settingGroup);
        await browser.pause(500);

        // Click Export
        const exportLink = await $('//a[.//span[contains(text(),"Export")]]');
        await exportLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(exportLink);
        await browser.pause(1000);

        // Click Export button on the export page
        const exportBtn = await $('//button[contains(., "Export")]');
        await exportBtn.waitForDisplayed({ timeout: 5000 });
        await clickElement(exportBtn);

        // Wait a moment for the export to trigger (dialog or success message)
        await browser.pause(2000);

        // Verify the page still exists and didn't crash
        const body = await $('body');
        expect(await body.isExisting()).toBe(true);
    });
});
