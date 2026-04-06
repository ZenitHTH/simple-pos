// E2E Test Helpers

async function setInputValue(element, value) {
    await element.waitForDisplayed({ timeout: 10000 });
    await browser.pause(500); // Give React elements time
    try {
        await element.setValue(value);
    } catch (e) {
        try {
            await browser.execute((el, val) => {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(el, val);
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }, element, value);
        } catch (innerE) {
            console.error("Fallback setting input", innerE);
        }
    }
    // CRITICAL: Wait for React render cycle to update stale closures
    await browser.pause(500);
}

async function clickElement(element) {
    if (!await element.isDisplayed()) {
        await browser.execute((el) => {
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }, element);
    }
    await browser.execute((el) => {
        if (el) el.click();
    }, element);
}

async function performLogin() {
    // Wait for either Login or Setup screen
    const appTitle = await $('h1');
    await appTitle.waitForExist({ timeout: 10000 });
    const titleText = await appTitle.getText();

    if (titleText.includes('Simple POS')) {
        // Welcome Screen
        const startBtn = await $('//button[contains(., "Start Setup")]');
        await clickElement(startBtn);
        await browser.pause(500);

        // Password Setup Screen
        const passwordInput = await $('input[placeholder="Enter a strong password"]');
        await passwordInput.waitForExist({ timeout: 5000 });
        await setInputValue(passwordInput, 'Runner01');

        const confirmInput = await $('input[placeholder="Repeat your password"]');
        await setInputValue(confirmInput, 'Runner01');

        const nextButton = await $('button[type="submit"]');
        await clickElement(nextButton);

        // Settings Setup Screen
        const finishSetupBtn = await $('//button[contains(., "Finish Setup")]');
        await finishSetupBtn.waitForExist({ timeout: 5000 });
        await clickElement(finishSetupBtn);
        // Wait for the Settings Setup to transition out
        await finishSetupBtn.waitForExist({ timeout: 5000, reverse: true });
    } else if (titleText.includes('Setup')) {
        // Password Setup Screen
        const passwordInput = await $('input[placeholder="Enter a strong password"]');
        await passwordInput.waitForExist({ timeout: 5000 });
        await setInputValue(passwordInput, 'Runner01');

        const confirmInput = await $('input[placeholder="Repeat your password"]');
        await setInputValue(confirmInput, 'Runner01');

        const nextButton = await $('button[type="submit"]');
        await clickElement(nextButton);

        // Settings Setup Screen
        const finishSetupBtn = await $('//button[contains(., "Finish Setup")]');
        await finishSetupBtn.waitForExist({ timeout: 5000 });
        await clickElement(finishSetupBtn);
        // Wait for the Settings Setup to transition out
        await finishSetupBtn.waitForExist({ timeout: 5000, reverse: true });
    } else if (titleText.includes('Login')) {
        // Login Screen
        const passwordInput = await $('input[placeholder="Enter password"]');
        await passwordInput.waitForExist({ timeout: 5000 });
        await passwordInput.waitForExist({ timeout: 5000 });
        await setInputValue(passwordInput, 'Runner01');

        const loginButton = await $('button[type="submit"]');
        await clickElement(loginButton);
        // Wait for login to transition out
        await loginButton.waitForExist({ timeout: 5000, reverse: true });
    }

    // Small pause to let POS screen load
    await browser.pause(1000);
}

async function navigateTo(groupName, linkName) {
    // Find hamburger and click if displayed (mobile/small screen sidebar collapsed state)
    const hamburgerBtn = await $('button.text-muted.-ml-2');
    if (await hamburgerBtn.isExisting() && await hamburgerBtn.isDisplayed()) {
        await clickElement(hamburgerBtn);
        await browser.pause(500); // wait for animation
    }

    if (groupName) {
        // Ensure Group is expanded
        const mgmtGroup = await $(`//button[.//span[contains(text(),"${groupName}")]]`);
        await mgmtGroup.waitForDisplayed({ timeout: 5000 });

        let targetLink = await $(`//a[.//span[contains(text(),"${linkName}")]]`);
        const isLinkDisplayed = await targetLink.isExisting() && await targetLink.isDisplayed();
        if (!isLinkDisplayed) {
            await clickElement(mgmtGroup);
            await browser.pause(500); // Wait for accordion animation
        }
    }

    // Click Link
    const freshLink = await $(`//a[.//span[contains(text(),"${linkName}")]]`);
    await freshLink.waitForDisplayed({ timeout: 5000 });
    await clickElement(freshLink);
    await browser.pause(500); // wait for page nav
}

// Interacts with the custom Select.tsx component
async function selectCustomDropdownByText(labelName, optionText) {
    // The onClick is attached to the first child div of the relative wrapper div
    const selectTrigger = await $(`//label[contains(text(), "${labelName}")]/following-sibling::div/div[1]`);
    await selectTrigger.waitForDisplayed({ timeout: 5000 });
    await selectTrigger.scrollIntoView({ block: 'center' });

    // Use JS to dispatch a click event instead of W3C Actions as Tauri has limitations
    await browser.execute((el) => {
        if (el) {
            el.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }
    }, selectTrigger);

    await browser.pause(1000); // Wait for dropdown animation

    // We use JS to bypass overlays/portals and dispatch a real MouseEvent
    await browser.execute((opt) => {
        const spans = Array.from(document.querySelectorAll('div.bg-popover span'));
        const targetSpan = spans.find(span => span.textContent.trim() === opt && span.parentElement && span.parentElement.classList.contains('cursor-pointer'));
        if (targetSpan && targetSpan.parentElement) {
            targetSpan.parentElement.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }
    }, optionText);

    // Wait for React to process the select onChange and update closures
    await browser.pause(500);
}

module.exports = {
    setInputValue,
    clickElement,
    performLogin,
    navigateTo,
    selectCustomDropdownByText
};
