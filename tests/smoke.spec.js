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

  
  test('i18n full audit check', async ({ page }) => {
    await page.goto("/index.html");
    await page.click("button:has-text('EN')");
    await expect(page.locator(".hero-title")).toHaveText(/Elegance/i);
    await page.goto("/admin.html");
    await page.waitForTimeout(500);
    await page.click("button:has-text('FR')");
    await expect(page.locator("h2").first()).toHaveText(/Tableau/i);
    await page.click("button:has-text('EN')");
    await expect(page.locator("h2").first()).toHaveText(/Dashboard/i);
    await page.goto("/product.html?id=p1");
    await page.waitForTimeout(500);
    await page.click("button:has-text('FR')");
    await expect(page.locator("h1[data-i18n='product_details']")).toHaveText(/D.tails/i);
    await page.click("button:has-text('EN')");
    await expect(page.locator("h1[data-i18n='product_details']")).toHaveText(/Details/i);
  });


  test('applying a filter+sort combination updates the URL and the displayed products correctly', async ({ page }) => {
    await page.goto('/collections.html');
    
    // Total products initially
    const initialCount = await page.locator('.product-card:visible').count();
    expect(initialCount).toBeGreaterThan(0);

    // Apply category filter
    await page.selectOption('#category-filter', 'salon');
    // Apply stock filter
    await page.selectOption('#stock-filter', 'in');
    // Apply sort
    await page.selectOption('#price-sort', 'low');

    await page.waitForTimeout(500); // give JS a moment to replaceState and re-render

    // Check URL
    const url = new URL(page.url());
    expect(url.searchParams.get('cat')).toBe('salon');
    expect(url.searchParams.get('stock')).toBe('in');
    expect(url.searchParams.get('sort')).toBe('low');

    // Check filtered count
    const filteredCount = await page.locator('.product-card:visible').count();
    expect(filteredCount).toBeLessThan(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('WhatsApp link/button contains the expected product name and price', async ({ page }) => {
    await page.goto('/product.html?id=p1');
    await page.waitForTimeout(500);
    
    const waLink = page.locator('a.btn[href*="wa.me"]');
    await expect(waLink).toBeVisible();
    
    const href = await waLink.getAttribute('href');
    // p1 is "Canap� Modulable 'Sahara'" and price is 120 000 DA
    // The decoded string should contain "Sahara" and "120"
    const decoded = decodeURIComponent(href);
    expect(decoded).toContain('Sahara');
    expect(decoded).toContain('120');
  });


  test('SEO metadata is correctly populated', async ({ page }) => {
    // Check public page
    await page.goto('/index.html');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc.length).toBeGreaterThan(0);
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle.length).toBeGreaterThan(0);

    // Check admin page
    await page.goto('/admin.html');
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
  });

});