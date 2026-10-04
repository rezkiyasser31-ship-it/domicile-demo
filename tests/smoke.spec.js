const { test, expect } = require('@playwright/test');

test.describe('Baseline Smoke Tests', () => {
  test('index.html loads', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Domicile/i);
  });

  test('collections.html catalog renders products', async ({ page }) => {
    await page.goto('/collections.html');
    const productCount = await page.locator('.product-card').count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('language toggle switches FR/EN text on at least one page', async ({ page }) => {
    await page.goto('/index.html');
    
    // Initially French
    const brandText = page.locator('.brand-wordmark');
    // We expect the wordmark or some nav text to change, or maybe hero. Let's check a nav link.
    const showroomLink = page.locator('.nav-link[data-i18n="nav_showroom"]');
    await expect(showroomLink).toHaveText(/Showroom/i); // Maybe same in EN/FR?
    
    // Let's check a specific string like nav_home
    const homeLink = page.locator('.nav-link[data-i18n="nav_home"]');
    await expect(homeLink).toHaveText(/Accueil/i);
    
    // Click EN button
    await page.click('button:has-text("EN")');
    
    // Check if it changes to English
    await expect(homeLink).toHaveText(/Home/i);
  });

  test('admin.html loads and the time-range selector swaps chart data', async ({ page }) => {
    await page.goto('/admin.html');
    await expect(page).toHaveTitle(/.*Administration.*/i);

    // time-range selector buttons
    const btn30 = page.locator('button.date-range-btn[data-range="30"]');
    await btn30.click();
    await expect(page.locator('#visitsChart')).toBeVisible();
    
    const btn90 = page.locator('button.date-range-btn[data-range="90"]');
    await btn90.click();
    await expect(page.locator('#visitsChart')).toBeVisible();
  });

  test('CSV export button triggers a download', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Switch to Inventory tab
    await page.click('button[data-target="inventory-tab"]');
    await expect(page.locator('#export-csv-btn')).toBeVisible();
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('export');
      await dialog.accept();
    });
    await page.click('#export-csv-btn');
  });

  test('i18n full audit check: FR/EN language toggle works completely on representative pages', async ({ page }) => {
    // Check index.html
    await page.goto('/index.html');
    await expect(page.locator('.hero-title')).toHaveText(/L'élégance|L.élégance/i);
    await page.click('button:has-text("EN")');
    await expect(page.locator('.hero-title')).toHaveText(/Elegance/i);
    
    // Check admin.html
    await page.goto('/admin.html');
    await page.waitForTimeout(500); // wait for dynamic updates
    await page.click('button:has-text("FR")');
    await expect(page.locator('h2').first()).toHaveText(/Tableau/i);
    await page.click('button:has-text("EN")');
    await expect(page.locator('h2').first()).toHaveText(/Dashboard/i);

    // Check product.html
    await page.goto('/product.html?id=p1');
    await page.waitForTimeout(500);
    await page.click('button:has-text("FR")');
    await expect(page.locator('h3:has-text("Détails")')).toBeVisible();
    await page.click('button:has-text("EN")');
    await expect(page.locator('h3:has-text("Details")')).toBeVisible();
  });

});
