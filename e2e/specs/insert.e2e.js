const { setInputValue, clickElement, performLogin, navigateTo, selectCustomDropdownByText } = require('./helpers');

describe('Simple POS Insert Data Tests', () => {

    before(async () => {
        // Start app and check login/setup
        await performLogin();
    });

    it('should create a test category', async () => {
        await navigateTo("Management", "Categories");

        const newCategoryBtn = await $('//button[.//span[text()="New Category"]]');
        await newCategoryBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newCategoryBtn);

        const nameInput = await $('//div[label[contains(text(), "Category Name")]]/input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, "Electronics");

        // The color input might be hidden or use a custom component, safely set it
        const colorInput = await $('//div[label[contains(text(), "Color")]]//input[@type="color"]');
        if (await colorInput.isExisting()) {
            await setInputValue(colorInput, "#ff0000");
        }

        const saveBtn = await $('button[type="submit"]');
        await clickElement(saveBtn);

        // Verify it was added
        const row = await $('//table//td[contains(., "Electronics")]');
        await row.waitForExist({ timeout: 10000 });
    });

    it('should create a test product', async () => {
        await navigateTo("Management", "Product Management");

        const newProductBtn = await $('//button[.//span[text()="New Product"]]');
        await newProductBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(newProductBtn);
        // Wait for React to finish executing the reset useEffect
        await browser.pause(1000);

        // Locate modal uniquely by its title header to avoid any ghost DOM elements
        const modalRoot = await $('//html//div[contains(@class, "fixed") and .//h2[text()="New Product"]]');
        await modalRoot.waitForDisplayed({ timeout: 5000 });

        const titleInput = await modalRoot.$('.//div[label[contains(text(), "Title")]]/input');
        await setInputValue(titleInput, "Test Product");

        const priceInput = await modalRoot.$('.//div[label[contains(text(), "Price")]]/input');
        await setInputValue(priceInput, "15000");

        // Use custom select helper for Category
        await selectCustomDropdownByText("Category", "Electronics");

        const saveProductBtn = await $('//button[contains(., "Save") or contains(., "Create")]');
        await saveProductBtn.waitForDisplayed({ timeout: 5000 });
        await clickElement(saveProductBtn);

        // Verify product in table
        const row = await $('//table//td[contains(., "Test Product")]');
        try {
            await row.waitForExist({ timeout: 10000 });
        } catch (err) {
            await browser.saveScreenshot('/home/zenithth/git/vibe-pos/e2e-error.png');
            throw err;
        }
    });

    it('should create a test material', async () => {
        await navigateTo("Management", "Inventory & Stock");

        // Click Raw Materials Tab
        const rawMatTab = await $('//button[contains(text(), "Raw Materials")]');
        await rawMatTab.waitForDisplayed({ timeout: 5000 });
        await clickElement(rawMatTab);
        await browser.pause(500);

        const addMatBtn = await $('//button[.//span[contains(text(), "Add Raw Material")]]');
        await addMatBtn.waitForDisplayed({ timeout: 10000 });
        await clickElement(addMatBtn);

        const nameInput = await $('//div[label[contains(text(), "Material Name")]]/input');
        await nameInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(nameInput, "Plastic Shell");

        const volumeInput = await $('//div[label[contains(text(), "Volume")]]/input');
        await setInputValue(volumeInput, "10");

        const qtyInput = await $('//div[label[contains(text(), "Quantity")]]/input');
        await setInputValue(qtyInput, "50");

        // Custom select for Type / Unit
        await selectCustomDropdownByText("Type / Unit", "Pieces");

        const saveBtn = await $('button[type="submit"]');
        await clickElement(saveBtn);

        // Verify material in table
        const row = await $('//table//td[contains(., "Plastic Shell")]');
        await row.waitForExist({ timeout: 10000 });
    });

});
