describe('Simple POS Insert Data Tests', () => {
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

    it('should create a test category', async () => {
        // Find hamburger and click if displayed
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500); // wait for animation
        }

        // Click "Management" to expand group
        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        let categoryLink = await $('//a[.//span[contains(text(),"Categories")]]');
        const isCatLinkDisplayed = await categoryLink.isExisting() && await categoryLink.isDisplayed();
        if (!isCatLinkDisplayed) {
            await clickElement(mgmtGroup);
            await browser.pause(500);
        }

        // Click "Categories"
        categoryLink = await $('//a[.//span[contains(text(),"Categories")]]');
        await categoryLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(categoryLink);

        // Wait for Manage Page to load and "New Category" button to appear
        const newCategoryBtn = await $('//button[.//span[text()="New Category"]]');
        await newCategoryBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newCategoryBtn);

        // Fill out modal
        const nameInput = await $('//div[label[contains(text(), "Category Name")]]/input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, "Electronics");

        const colorInput = await $('//div[label[contains(text(), "Color")]]//input[@type="color"]');
        if (await colorInput.isExisting()) {
            await setInputValue(colorInput, "#ff0000");
        }

        // Click Save Category
        const saveCategoryBtn = await $('button[type="submit"]');
        await clickElement(saveCategoryBtn);

        // Wait for it to appear in table (modal closes)
        const row = await $('//table//td[contains(., "Electronics")]');
        await row.waitForExist({ timeout: 10000 });
    });

    it('should create a test product', async () => {
        // Find hamburger and click if displayed
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500); // wait for animation
        }

        // Ensure "Management" group is expanded. Expand if necessary.
        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        let prodMgmtLink = await $('//a[.//span[contains(text(),"Product Management")]]');
        const isProdLinkDisplayed = await prodMgmtLink.isExisting() && await prodMgmtLink.isDisplayed();
        if (!isProdLinkDisplayed) {
            await clickElement(mgmtGroup);
            await browser.pause(500); // Wait for accordion animation
        }

        // Wait a bit and Click "Product Management"
        await browser.pause(500);
        const freshProdMgmtLink = await $('//a[.//span[contains(text(),"Product Management")]]');
        await freshProdMgmtLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(freshProdMgmtLink);

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

        // Select category
        const categorySelectTrigger = await $('//label[contains(text(), "Category")]/following-sibling::div');
        await categorySelectTrigger.waitForDisplayed({ timeout: 5000 });
        await clickElement(categorySelectTrigger);
        await browser.pause(1000); // Wait for dropdown animation

        // We use JS to bypass overlays/portals and click "Electronics" option
        await browser.execute(() => {
            const spans = Array.from(document.querySelectorAll('div.bg-popover span'));
            // Find "Electronics" category option specifically
            const categorySpan = spans.find(span => span.textContent.trim() === 'Electronics' && span.parentElement && span.parentElement.classList.contains('cursor-pointer'));
            if (categorySpan && categorySpan.parentElement) {
                categorySpan.parentElement.click();
            }
        });
        await browser.pause(500);

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
    });

    it('should create a test material', async () => {
        // Wait for animation
        await browser.pause(1000);

        // Find hamburger and click if displayed
        const hamburgerBtn = await $('button.text-muted.-ml-2');
        if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
            await clickElement(hamburgerBtn);
            await browser.pause(500); // wait for animation
        }

        // Ensure "Management" group is expanded. Expand if necessary.
        const mgmtGroup = await $('//button[.//span[contains(text(),"Management")]]');
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        // Wait briefly for React to render links if they exist
        await browser.pause(500);

        let stockMgmtLink = await $('//a[.//span[contains(text(),"Inventory & Stock")]]');

        // If it's not displayed, it means the accordion is closed, so click Management
        const isStockLinkDisplayed = await stockMgmtLink.isExisting() && await stockMgmtLink.isDisplayed();
        if (!isStockLinkDisplayed) {
            await clickElement(mgmtGroup);
            await browser.pause(500); // Wait for accordion animation
        }

        // Click "Inventory & Stock"
        stockMgmtLink = await $('//a[.//span[contains(text(),"Inventory & Stock")]]'); // Re-query just in case
        await stockMgmtLink.waitForDisplayed({ timeout: 5000 });
        await clickElement(stockMgmtLink);
        await browser.pause(1000);

        // Wait for Stock page to load the tabs
        await browser.pause(1000);

        // Click "Raw Materials" tab
        const materialsTab = await $('//button[contains(text(),"Raw Materials")]');
        await materialsTab.waitForDisplayed({ timeout: 5000 });
        await clickElement(materialsTab);
        await browser.pause(500);

        // Wait for "Add Raw Material" button to appear
        const addMaterialBtn = await $('//button[.//span[contains(text(),"Add Raw Material")]]');
        await addMaterialBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(addMaterialBtn);

        // Fill out modal
        const nameInput = await $('//div[label[contains(text(), "Material Name")]]/input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, "Plastic Shell");

        const volumeInput = await $('//div[label[contains(text(), "Volume")]]/input');
        await setInputValue(volumeInput, "10");

        const qtyInput = await $('//div[label[contains(text(), "Quantity")]]/input');
        await setInputValue(qtyInput, "50");

        // Select type using custom Select component
        // 1. Click the trigger
        const typeSelectTrigger = await $('//label[contains(text(), "Type / Unit")]/following-sibling::div');
        await typeSelectTrigger.waitForDisplayed({ timeout: 5000 });
        await clickElement(typeSelectTrigger);
        await browser.pause(1000); // Wait for dropdown animation and React mount

        // 2. Click "Pieces" option from the dropdown menu.
        // Use JS to bypass overlays/portals that might block clicking
        await browser.execute(() => {
            const spans = Array.from(document.querySelectorAll('div.bg-popover span'));
            const piecesSpan = spans.find(span => span.textContent.trim() === 'Pieces');
            if (piecesSpan && piecesSpan.parentElement) {
                piecesSpan.parentElement.click();
            }
        });
        await browser.pause(500);

        // Click Save Material
        const saveMaterialBtn = await $('button[type="submit"]');
        await clickElement(saveMaterialBtn);

        // Wait for it to appear in table (modal closes)
        const row = await $('//table//td[contains(., "Plastic Shell")]');
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
});
