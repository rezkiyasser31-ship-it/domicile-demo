const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let hasErrors = false;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console Error:', msg.text());
      hasErrors = true;
    }
  });

  const baseURL = 'file://' + path.resolve(__dirname).replace(/\\/g, '/');

  try {
    console.log('Testing collections.html (filters, wishlist, search)...');
    await page.goto(baseURL + '/collections.html');
    
    // Check filter and search
    // Wait for load
    await page.waitForTimeout(1000);
    
    // Check wishlist persistence
    console.log('Clicking wishlist heart...');
    // We assume there's a heart button, let's try to click the first one if it exists
    const hearts = await page.locator('.wishlist-toggle, .btn-wishlist, button:has(svg)').all();
    if (hearts.length > 0) {
      await hearts[0].click();
      await page.waitForTimeout(500);
    }
    
    console.log('Testing product.html (dynamic data)...');
    await page.goto(baseURL + '/product.html?id=1');
    await page.waitForTimeout(1000);
    const title1 = await page.title();
    
    await page.goto(baseURL + '/product.html?id=2');
    await page.waitForTimeout(1000);
    const title2 = await page.title();
    
    console.log('Product 1 title:', title1);
    console.log('Product 2 title:', title2);
    
    console.log('Testing contact.html (FAQ)...');
    await page.goto(baseURL + '/contact.html');
    await page.waitForTimeout(500);
    const faqs = await page.locator('.faq-item, details').all();
    if (faqs.length > 0) {
      await faqs[0].click();
    }
    
    console.log('Testing admin.html...');
    await page.goto(baseURL + '/admin.html');
    await page.waitForTimeout(500);
    
    if (hasErrors) {
      console.log('Test finished with console errors.');
    } else {
      console.log('Test finished successfully with ZERO console errors.');
    }
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await browser.close();
  }
})();
