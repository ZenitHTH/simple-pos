describe('Simple POS', () => {
  it('should have correct title', async () => {
    // Wait for the app to load
    await browser.pause(2000);
    const title = await browser.getTitle();
    expect(title).toBe('Simple POS');
  });

  it('should verify the app is running', async () => {
    const body = await $('body');
    const isExisting = await body.isExisting();
    expect(isExisting).toBe(true);
  });
});
