const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    let consoleErrors = 0;
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error(`PAGE ERROR: ${msg.text()}`);
            consoleErrors++;
        }
    });

    let alertFired = false;
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        alertFired = true;
        await dialog.dismiss();
    });

    const url = 'file://' + __dirname.replace(/\\/g, '/') + '/index.html';
    await page.goto(url);

    // Initial language is French
    let trustBadge = await page.locator('[data-i18n="str_104"]').textContent();
    console.log(`FR Trust Badge text: ${trustBadge.trim()}`);

    // Click EN button
    await page.locator('button', { hasText: 'EN' }).click();
    
    // Wait for a bit
    await page.waitForTimeout(500);

    // Check if alert fired
    if (alertFired) {
        console.error("FAIL: Alert dialog fired on EN button click!");
    } else {
        console.log("PASS: No alert dialog on EN button click.");
    }

    // Check English language
    trustBadge = await page.locator('[data-i18n="str_104"]').textContent();
    console.log(`EN Trust Badge text: ${trustBadge.trim()}`);
    if (trustBadge.trim() === 'Cash on Delivery') {
        console.log("PASS: Trust badge successfully translated to English.");
    } else {
        console.error(`FAIL: Trust badge did not translate correctly. Expected 'Cash on Delivery', got '${trustBadge.trim()}'`);
    }
    
    // Check other elements
    const heroTitle = await page.locator('[data-i18n="hero_title"]').textContent();
    console.log(`EN Hero Title: ${heroTitle.trim()}`);
    
    const contactNav = await page.locator('nav >> text=Contact').first().textContent();
    console.log(`EN Contact Nav: ${contactNav.trim()}`);
    
    // Click AR button to ensure it STILL shows the alert
    alertFired = false;
    await page.locator('button', { hasText: 'AR' }).click();
    await page.waitForTimeout(500);
    if (alertFired) {
        console.log("PASS: Alert dialog successfully fired on AR button click (Coming soon).");
    } else {
        console.error("FAIL: No alert dialog on AR button click!");
    }

    console.log(`Console Errors: ${consoleErrors}`);

    await browser.close();
    
    if (consoleErrors > 0) {
        process.exit(1);
    }
})();
