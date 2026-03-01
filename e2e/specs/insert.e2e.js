describe('Simple POS Insert Data Tests', () => {
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

    it('should create a test category', async () => {
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        let categoryLink = await $('//a[.//span[contains(text(),"Categories")]]');
        if (!(await categoryLink.isExisting() && await categoryLink.isDisplayed())) {
            await clickElement(mgmtGroup);
            await browser.pause(500);
        }

        categoryLink = await $('//a[.//span[contains(text(),"Categories")]]');
        await categoryLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(categoryLink);

        const newCategoryBtn = await $('//button[contains(., "New Category")]');
        await newCategoryBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newCategoryBtn);

        const nameInput = await $('//label[contains(text(), "Category Name")]/following-sibling::input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, "Electronics");

        const colorInput = await $('//label[contains(text(), "Color")]/following-sibling::input[@type="color"]');
        if (await colorInput.isExisting()) {
            await setInputValue(colorInput, "#ff0000");
        }

        const saveCategoryBtn = await $('button[type="submit"]');
        await clickElement(saveCategoryBtn);

        const row = await $('//table//td[contains(., "Electronics")]');
        await row.waitForExist({ timeout: 10000 });
    });

    it('should create a test product', async () => {
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        let prodMgmtLink = await $('//a[.//span[contains(text(),"Product Management")]]');
        if (!(await prodMgmtLink.isExisting() && await prodMgmtLink.isDisplayed())) {
            await clickElement(mgmtGroup);
            await browser.pause(500);
        }

        await browser.pause(500);
        prodMgmtLink = await $('//a[.//span[contains(text(),"Product Management")]]');
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

        const categorySelectTrigger = await $('//label[contains(text(), "Category")]/following-sibling::div');
        await categorySelectTrigger.waitForDisplayed({ timeout: 5000 });
        await clickElement(categorySelectTrigger);
        await browser.pause(1000);

        await browser.execute(() => {
            const spans = Array.from(document.querySelectorAll('div.bg-popover span'));
            const categorySpan = spans.find(span => span.textContent.trim() === 'Electronics');
            if (categorySpan && categorySpan.parentElement) {
                categorySpan.parentElement.click();
            }
        });
        await browser.pause(500);

        const saveProductBtn = await $('//button[contains(., "Save Product")]');
        await clickElement(saveProductBtn);

        const row = await $('//table//td[contains(., "Xbox Controller")]');
        await row.waitForExist({ timeout: 10000 });
    });

    it('should create a test material', async () => {
        await browser.pause(1000);
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500);
        }

        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        let stockMgmtLink = await $('//a[.//span[contains(text(),"Inventory")]]');
        if (!(await stockMgmtLink.isExisting() && await stockMgmtLink.isDisplayed())) {
            await clickElement(mgmtGroup);
            await browser.pause(500);
        }

        stockMgmtLink = await $('//a[.//span[contains(text(),"Inventory")]]');
        await stockMgmtLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(stockMgmtLink);
        await browser.pause(1000);

        const materialsTab = await $('//button[contains(text(),"Raw Material")]');
        await materialsTab.waitForDisplayed({ timeout: 5000 });
        await clickElement(materialsTab);
        await browser.pause(500);

        const addMaterialBtn = await $('//button[contains(., "Add Raw Material")]');
        await addMaterialBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(addMaterialBtn);

        const nameInput = await $('//label[contains(text(), "Material Name")]/following-sibling::input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, "Plastic Shell");

        const volumeInput = await $('//label[contains(text(), "Volume")]/following-sibling::input');
        if (await volumeInput.isExisting()) {
            await setInputValue(volumeInput, "10");
        }

        const typeSelectTrigger = await $('//label[contains(text(), "Type")]/following-sibling::div');
        if (await typeSelectTrigger.isExisting()) {
            await clickElement(typeSelectTrigger);
            await browser.pause(1000);
            await browser.execute(() => {
                const spans = Array.from(document.querySelectorAll('div.bg-popover span'));
                const piecesSpan = spans.find(span => span.textContent.trim() === 'Pieces');
                if (piecesSpan && piecesSpan.parentElement) piecesSpan.parentElement.click();
            });
        }
        await browser.pause(500);

        const saveMaterialBtn = await $('//button[contains(., "Save")]');
        await clickElement(saveMaterialBtn);

        const row = await $('//table//td[contains(., "Plastic Shell")]');
        await row.waitForExist({ timeout: 10000 });
    });
});
