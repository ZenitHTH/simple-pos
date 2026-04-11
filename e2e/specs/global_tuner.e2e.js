describe('GlobalTuner Component', () => {
    it('should render ThemePresetsPanel and GlobalStylesPanel', async () => {
        await browser.url('http://127.0.0.1:3000/test-tuner');
        
        const presetsHeading = await $('h2=Presets');
        const stylesHeading = await $('h2=Global Styles');
        
        await expect(presetsHeading).toBeDisplayed();
        await expect(stylesHeading).toBeDisplayed();
    });
});
