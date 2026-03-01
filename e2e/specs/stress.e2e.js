const { clickElement, performLogin, navigateTo, setInputValue, selectCustomDropdownByText } = require('./helpers');

describe('Simple POS Full Simulation (Stress) Test', () => {

    before(async () => {
        await performLogin();
    });

    it('should complete a full lifecycle: Insert -> Recipe -> POS Checkout -> Delete', async () => {
        // --- 1. INSERT CATEGORY ---
        await navigateTo("Management", "Categories");
        let btn = await $('//button[.//span[text()="New Category"]]');
        await btn.waitForDisplayed({ timeout: 10000 });
        await clickElement(btn);

        const catModalRoot = await $('//html//div[contains(@class, "fixed") and .//h2[text()="New Category"]]');
        await catModalRoot.waitForDisplayed({ timeout: 5000 });

        let input = await catModalRoot.$('.//div[label[contains(text(), "Category Name")]]/input');
        await setInputValue(input, "Stress Category");
        await clickElement(await catModalRoot.$('button[type="submit"]'));

        let row = await $('//table//td[contains(., "Stress Category")]');
        await row.waitForExist({ timeout: 10000 });

        // --- 2. INSERT PRODUCT ---
        await navigateTo("Management", "Product Management");
        btn = await $('//button[.//span[text()="New Product"]]');
        await btn.waitForDisplayed({ timeout: 10000 });
        await clickElement(btn);

        const prodModalRoot = await $('//html//div[contains(@class, "fixed") and .//h2[text()="New Product"]]');
        await prodModalRoot.waitForDisplayed({ timeout: 5000 });

        input = await prodModalRoot.$('.//div[label[contains(text(), "Title")]]/input');
        await setInputValue(input, "Stress Product");

        input = await prodModalRoot.$('.//div[label[contains(text(), "Price")]]/input');
        await setInputValue(input, "25000"); // ฿250

        await selectCustomDropdownByText("Category", "Stress Category");
        await clickElement(await prodModalRoot.$('button[type="submit"]'));

        row = await $('//table//td[contains(., "Stress Product")]');
        await row.waitForExist({ timeout: 10000 });

        // ENABLE RECIPE STOCK FOR PRODUCT
        // Find the toggle (Switch) explicitly for recipe stock
        const toggleBtn = await row.$('button[role="switch"]');
        if (await toggleBtn.isExisting()) {
            await clickElement(toggleBtn);
            await browser.pause(500);
        }

        // --- 3. INSERT MATERIAL ---
        await navigateTo("Management", "Inventory & Stock");
        const rawMatTab = await $('//button[contains(text(), "Raw Materials")]');
        await rawMatTab.waitForDisplayed({ timeout: 5000 });
        await clickElement(rawMatTab);
        await browser.pause(500);

        btn = await $('//button[.//span[contains(text(), "Add Raw Material")]]');
        await btn.waitForDisplayed({ timeout: 10000 });
        await clickElement(btn);

        const matModalRoot = await $('//html//div[contains(@class, "fixed") and .//h2[text()="Add Material"]]');
        await matModalRoot.waitForDisplayed({ timeout: 5000 });

        input = await matModalRoot.$('.//div[label[contains(text(), "Material Name")]]/input');
        await setInputValue(input, "Stress Material");

        input = await matModalRoot.$('.//div[label[contains(text(), "Volume")]]/input');
        await setInputValue(input, "1000"); // 1000 Grams

        input = await matModalRoot.$('.//div[label[contains(text(), "Quantity")]]/input');
        await setInputValue(input, "10"); // 10 Packs

        await selectCustomDropdownByText("Type / Unit", "Pack");
        await clickElement(await matModalRoot.$('button[type="submit"]'));

        row = await $('//table//td[contains(., "Stress Material")]');
        await row.waitForExist({ timeout: 10000 });

        // --- 4. CREATE RECIPE ---
        btn = await $('//a[.//span[contains(text(), "Recipe Builder")]]');
        await btn.waitForDisplayed({ timeout: 5000 });
        await clickElement(btn);

        input = await $('input[placeholder="Search products to build recipe..."]');
        await input.waitForDisplayed({ timeout: 5000 });
        await setInputValue(input, "Stress Product");

        btn = await $('//button[.//span[text()="Stress Product"]]');
        await btn.waitForDisplayed({ timeout: 5000 });
        await clickElement(btn);
        await browser.pause(500);

        input = await $('input[placeholder="Search materials..."]');
        await input.waitForDisplayed({ timeout: 5000 });
        await setInputValue(input, "Stress Material");

        // Find the div containing the span "Stress Material", then find the parent button
        btn = await $('//div[.//span[text()="Stress Material"]]/button');
        await btn.waitForDisplayed({ timeout: 5000 });
        await browser.execute((el) => { if (el) el.click(); }, btn);
        await browser.pause(1000);

        input = await $('//input[@type="number"]');
        await input.waitForDisplayed({ timeout: 5000 });
        await setInputValue(input, "250"); // Uses 250 Grams

        await selectCustomDropdownByText("Unit", "Gram");

        btn = await $('//button[contains(., "Save Recipe")]');
        await clickElement(btn);
        await browser.pause(1000); // give time for success message

        // --- 5. POS CHECKOUT ---
        await navigateTo(null, "Main Page");
        // Note: Navigate helper assumes a link name exactly matching text. 
        // POS usually has "Point of Sale" or just click a home icon. Let's assume there's a link "Point of Sale" or "Home".
        // Instead of helper, let's just click the App Logo or "Point of Sale" in sidebar.
        let posLink = await $('//a[.//span[contains(translate(text(), "POS", "pos"), "pos") or contains(translate(text(), "HOME", "home"), "home") or contains(text(), "Point of Sale")]]');
        if (await posLink.isExisting()) {
            await clickElement(posLink);
            await browser.pause(1000);
        }

        const productCard = await $('//h3[text()="Stress Product"]/ancestor::div[contains(@class, "bg-card")][1]');
        await productCard.waitForDisplayed({ timeout: 10000 });
        await browser.execute((el) => { if (el) el.click(); }, productCard);
        await browser.pause(500);

        await browser.execute(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const checkoutBtn = btns.find(b => b.textContent.toLowerCase().includes('charge') || b.textContent.toLowerCase().includes('checkout'));
            if (checkoutBtn) checkoutBtn.click();
        });
        await browser.pause(1000);

        // Payment Modal Exact Cash and Confirm
        await browser.execute(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const quickBtn = btns.find(b => b.classList.contains('border-primary/20'));
            if (quickBtn) quickBtn.click();
        });
        await browser.pause(500);

        await browser.execute(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const confirmBtn = btns.find(b => b.textContent.toLowerCase().includes('confirm') || b.textContent.toLowerCase().includes('pay'));
            if (confirmBtn && !confirmBtn.classList.contains('border-primary/20')) {
                confirmBtn.click();
            }
        });
        await browser.pause(2000);

        // --- 6. CLEAN UP (DELETE) ---
        // Delete Product
        await navigateTo("Management", "Product Management");
        row = await $('//table//tr[.//td[contains(., "Stress Product")]]');
        if (await row.isExisting()) {
            await row.waitForExist({ timeout: 10000 });
            await clickElement(await row.$('button[title="Delete"]'));
            try { await browser.acceptAlert(); } catch (e) { }
            await browser.pause(1000);
        }

        // Delete Material
        await navigateTo("Management", "Inventory & Stock");
        await clickElement(await $('//button[contains(text(), "Raw Materials")]'));
        await browser.pause(500);
        row = await $('//table//tr[.//td[contains(., "Stress Material")]]');
        if (await row.isExisting()) {
            await row.waitForExist({ timeout: 10000 });
            const deleteBtn = await row.$('button[title="Delete material"]');
            if (await deleteBtn.isExisting()) {
                await clickElement(deleteBtn);
            } else {
                await clickElement(await row.$('button[title="Delete"]'));
            }
            try { await browser.acceptAlert(); } catch (e) { }
            await browser.pause(1000);
        }

        // Delete Category
        await navigateTo("Management", "Categories");
        row = await $('//table//tr[.//td[contains(., "Stress Category")]]');
        if (await row.isExisting()) {
            await row.waitForExist({ timeout: 10000 });
            await clickElement(await row.$('button[title="Delete"]'));
            try { await browser.acceptAlert(); } catch (e) { }
            await browser.pause(1000);
        }
    });

});
