const { clickElement, performLogin, navigateTo, setInputValue, selectCustomDropdownByText } = require('./helpers');

describe('Simple POS Recipe Builder Tests', () => {

    before(async () => {
        // Start app and check login/setup
        await performLogin();
    });

    it('should create a recipe linking a material to a product', async () => {
        // Navigate to Recipe Builder
        await navigateTo("Management", "Inventory & Stock");

        const rawMatTab = await $('//button[contains(text(), "Raw Materials")]');
        await rawMatTab.waitForDisplayed({ timeout: 5000 });
        await clickElement(rawMatTab);
        await browser.pause(500);

        const recipeBuilderBtn = await $('//button[.//span[contains(text(), "Recipe Builder")]]');
        await recipeBuilderBtn.waitForDisplayed({ timeout: 5000 });
        await clickElement(recipeBuilderBtn);

        // In Recipe Builder, select the "Test Product"
        const productSearch = await $('input[placeholder="Search products to build recipe..."]');
        await productSearch.waitForDisplayed({ timeout: 5000 });
        await setInputValue(productSearch, "Test Product");

        const productSelectBtn = await $('//button[.//span[text()="Test Product"]]');
        await productSelectBtn.waitForDisplayed({ timeout: 5000 });
        await clickElement(productSelectBtn);
        await browser.pause(500); // pause for UI transition to right pane

        // Search for the material in the left pane
        const materialSearch = await $('input[placeholder="Search materials..."]');
        await materialSearch.waitForDisplayed({ timeout: 5000 });
        await setInputValue(materialSearch, "Plastic Shell");

        // Click the + button to add the material
        // Find the div containing the span "Plastic Shell", then find the button inside it
        const materialItemPlusBtn = await $('//div[.//span[text()="Plastic Shell"]]//button');
        await materialItemPlusBtn.waitForDisplayed({ timeout: 5000 });
        await clickElement(materialItemPlusBtn);
        await browser.pause(500);

        // Update the added material's volume to 2
        // Wait for it to appear in target pane
        const targetVolumeInput = await $('//div[div[p[text()="Plastic Shell"]]]//input[@type="number"]');
        await targetVolumeInput.waitForDisplayed({ timeout: 5000 });
        await setInputValue(targetVolumeInput, "2");

        // The unit is already a custom select inside the RecipeTargetItem
        // It has label "Unit" inside a tiny flex col. Our helper looks for label containing text. 
        await selectCustomDropdownByText("Unit", "Pieces");

        // Save Recipe
        const saveRecipeBtn = await $('//button[contains(., "Save Recipe")]');
        await clickElement(saveRecipeBtn);

        // Verification: The success message pops up and button stops saying saving
        const successMsg = await $('//div[contains(text(), "saved successfully")]');
        await successMsg.waitForExist({ timeout: 10000 });
    });
});
