const { clickElement, performLogin, navigateTo } = require('./helpers');

describe('Simple POS Delete Data Tests', () => {

    before(async () => {
        // Start app and check login/setup
        await performLogin();
    });

    it('should delete a test product', async () => {
        await navigateTo("Management", "Product Management");

        // Find the product row (created in insert.e2e.js or assume exists)
        const row = await $('//table//tr[.//td[contains(., "Test Product")]]');

        if (await row.isExisting()) {
            await row.waitForExist({ timeout: 10000 });

            // Find and click the delete button within that row
            const deleteBtn = await row.$('button[title="Delete"]');
            await clickElement(deleteBtn);

            // Handle native window.confirm alert
            try { await browser.acceptAlert(); } catch (e) { }

            // Verify product was deleted
            await row.waitForExist({ timeout: 10000, reverse: true });
        }
    });

    it('should delete a test material', async () => {
        await navigateTo("Management", "Inventory & Stock");

        // Click Raw Materials Tab
        const rawMatTab = await $('//button[contains(text(), "Raw Materials")]');
        await rawMatTab.waitForDisplayed({ timeout: 5000 });
        await clickElement(rawMatTab);
        await browser.pause(500);

        // Find the material row
        const row = await $('//table//tr[.//td[contains(., "Plastic Shell")]]');

        if (await row.isExisting()) {
            await row.waitForExist({ timeout: 10000 });

            // Find and click the delete button
            const deleteBtn = await row.$('button[title="Delete material"]');
            await clickElement(deleteBtn);

            // Handle alert
            try { await browser.acceptAlert(); } catch (e) { }

            // Verify material was deleted
            await row.waitForExist({ timeout: 10000, reverse: true });
        }
    });

    it('should delete a test category', async () => {
        await navigateTo("Management", "Categories");

        // Find the category row
        const row = await $('//table//tr[.//td[contains(., "Electronics")]]');

        if (await row.isExisting()) {
            await row.waitForExist({ timeout: 10000 });

            const deleteBtn = await row.$('button[title="Delete"]');
            await clickElement(deleteBtn);

            try { await browser.acceptAlert(); } catch (e) { }

            await row.waitForExist({ timeout: 10000, reverse: true });
        }
    });
});
