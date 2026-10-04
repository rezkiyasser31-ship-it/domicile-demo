const fs = require('fs');
let content = fs.readFileSync('tests/smoke.spec.js', 'utf8');

content = content.replace(/await expect\(page\.locator\('h1'\)\)\.toBeVisible\(\);/g, '');

content = content.replace(/await page\.click\('button:has-text\("FR"\)'\);/g, `await page.click('button:has-text("FR")');
    await expect(page.locator('h1[data-i18n="product_details"]')).toHaveText(/D.tails/i);`);

content = content.replace(/await page\.click\('button:has-text\("EN"\)'\);/g, `await page.click('button:has-text("EN")');
    await expect(page.locator('h1[data-i18n="product_details"]')).toHaveText(/Details/i);`);

fs.writeFileSync('tests/smoke.spec.js', content, 'utf8');
