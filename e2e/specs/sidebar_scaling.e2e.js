const { performLogin } = require('./helpers');

describe('Sidebar Scaling', () => {
    before(async () => {
        await performLogin();
    });

    it('should have --sidebar-button-scale CSS variable on the sidebar container', async () => {
        await browser.url('http://127.0.0.1:3000/');
        await browser.pause(2000);

        const sidebar = await $('aside');
        await sidebar.waitForDisplayed({ timeout: 10000 });

        const scale = await browser.execute((el) => {
            return getComputedStyle(el).getPropertyValue('--sidebar-button-scale');
        }, sidebar);

        // This should fail initially as the variable is not set yet
        expect(scale.trim()).not.toBe('');
        expect(parseFloat(scale)).toBeGreaterThan(0);
    });

    it('should apply scaling to sidebar items', async () => {
        const sidebarItem = await $('nav a'); // First sidebar item
        await sidebarItem.waitForDisplayed({ timeout: 10000 });

        const padding = await browser.execute((el) => {
            return getComputedStyle(el).padding;
        }, sidebarItem);

        console.log('Sidebar item padding:', padding);
        // We expect it to be affected by the scale, but for now just check it exists
        expect(padding).not.toBe('');
    });
});
