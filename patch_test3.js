const fs = require('fs');
let c = fs.readFileSync('tests/smoke.spec.js', 'utf8');

c = c.replace(/  \}\);\n\n  \}\);\n$/g, `  });

  test('i18n full audit check', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('button:has-text("EN")');
    await expect(page.locator('.hero-title')).toHaveText(/Elegance/i);

    await page.goto('/admin.html');
    await page.waitForTimeout(500);
    await page.click('button:has-text("FR")');
    await expect(page.locator('h2').first()).toHaveText(/Tableau/i);
    await page.click('button:has-text("EN")');
    await expect(page.locator('h2').first()).toHaveText(/Dashboard/i);

    await page.goto('/product.html?id=p1');
    await page.waitForTimeout(500);
    await page.click('button:has-text("FR")');
    await expect(page.locator('h1[data-i18n="product_details"]')).toHaveText(/D.tails/i);
    await page.click('button:has-text("EN")');
    await expect(page.locator('h1[data-i18n="product_details"]')).toHaveText(/Details/i);
  });
});
`);

fs.writeFileSync('tests/smoke.spec.js', c);
