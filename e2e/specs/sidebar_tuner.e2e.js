describe('SidebarTuner', () => {
    it('should have a Button Scale slider and NOT have a Sidebar Width slider', async () => {
        // This is a placeholder since we are in a headless environment and 
        // running the full E2E suite might be too heavy or impossible.
        // However, we follow the TDD rule: Write the test first.
        
        await browser.url('http://127.0.0.1:3000/design/tuner');
        
        // Navigate to Sidebar tab if not default
        const sidebarTab = await $('button[aria-label="Sidebar"]');
        if (await sidebarTab.isExisting()) {
            await sidebarTab.click();
        }

        const buttonScaleSlider = await $('label=Button Scale');
        await expect(buttonScaleSlider).toBeDisplayed();

        const sidebarWidthSlider = await $('label=Sidebar Width');
        await expect(sidebarWidthSlider).not.toExist();
    });
});
