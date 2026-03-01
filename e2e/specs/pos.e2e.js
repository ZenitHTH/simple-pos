const { clickElement, performLogin } = require('./helpers');

describe('Simple POS Terminal Tests', () => {

    before(async () => {
        // Start app and check login/setup
        await performLogin();
    });

    it('should add a product to the cart and complete a transaction', async () => {
        // The POS is the home page.
        // Wait for products to load
        const productCard = await $('//h3[text()="Test Product"]/ancestor::div[contains(@class, "bg-card")][1]');
        await productCard.waitForDisplayed({ timeout: 10000 });

        // Add to cart by clicking the card body (bypassing the Add to Cart hover overlay if needed, or JS click)
        await browser.execute((el) => {
            if (el) el.click();
        }, productCard);
        await browser.pause(500);

        // Verify it was added to Cart by checking Cart items
        const cartItemTitle = await $('//div[contains(@class, "font-bold") and text()="Test Product"]');
        await cartItemTitle.waitForExist({ timeout: 5000 });

        // Click Checkout button. In our app it's usually "Charge" or "Checkout"
        // Let's find a button with "Charge" or "Checkout"
        // Usually, the total amount is listed. We'll use JS to click the Checkout button because it might be inside the sidebar.
        await browser.execute(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const checkoutBtn = btns.find(b => b.textContent.toLowerCase().includes('charge') || b.textContent.toLowerCase().includes('checkout'));
            if (checkoutBtn) checkoutBtn.click();
        });
        await browser.pause(1000);

        // Payment Modal should be open.
        // The modal title contains "Cash Payment"
        const modalTitle = await $('//div[contains(., "Cash Payment")]');
        await modalTitle.waitForDisplayed({ timeout: 5000 });

        // Click the Exact Amount quick button (Test product is 15000 satang = 150 formatted)
        // Since we are not sure the exact format (฿150.00 or 150), we can just JS click the first quick amount button
        // Or type '150' using the VirtualNumpad
        await browser.execute(() => {
            // Virtual numpad buttons have textContent of "1", "5", "0"
            const btns = Array.from(document.querySelectorAll('button'));
            const getBtn = (char) => btns.find(b => b.textContent.trim() === char);

            getBtn('1')?.click();
            getBtn('5')?.click();
            getBtn('0')?.click();
            getBtn('0')?.click();
            getBtn('0')?.click(); // Depending on decimal configuration, hitting 150 enough times covers it, or exact quick amounts.

            // Actually, quick amount buttons are easier. They are above the numpad and have "variant='outline'".
            const quickBtn = btns.find(b => b.classList.contains('border-primary/20'));
            if (quickBtn) quickBtn.click();
        });
        await browser.pause(500);

        // Click Confirm/Complete Payment
        // It's the button inside the PaymentFooter
        await browser.execute(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const confirmBtn = btns.find(b => b.textContent.toLowerCase().includes('confirm') || b.textContent.toLowerCase().includes('complete') || b.textContent.toLowerCase().includes('pay'));
            // Filter to actual action buttons
            if (confirmBtn && !confirmBtn.classList.contains('border-primary/20')) {
                confirmBtn.click();
            }
        });

        // Wait for modal to close indicating success
        await modalTitle.waitForExist({ timeout: 10000, reverse: true });

        // Verification: The cart should be empty now
        const emptyCartMsg = await $('//div[contains(text(), "Your cart is empty")]');
        await emptyCartMsg.waitForExist({ timeout: 5000 });
    });
});
