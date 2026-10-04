const { test, expect } = require('@playwright/test');

const pages = [
  '/index.html',
  '/about.html',
  '/services.html',
  '/collections.html',
  '/showroom.html',
  '/contact.html',
  '/product.html?id=p1',
  '/admin.html'
];

test.describe('Console Errors Check', () => {
  for (const p of pages) {
    test(`check console for ${p}`, async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          const text = msg.text();
          // Filter out the known Tailwind CDN warning
          if (!text.includes('cdn.tailwindcss.com should not be used in production')) {
            errors.push(`[${msg.type()}] ${text}`);
          }
        }
      });
      page.on('pageerror', err => {
        errors.push(`[pageerror] ${err.message}`);
      });
      
      await page.goto(p);
      await page.waitForLoadState('networkidle');
      
      if (errors.length > 0) {
        console.log(`Errors on ${p}:`);
        errors.forEach(e => console.log('  ' + e));
      }
      expect(errors.length).toBe(0);
    });
  }
});
