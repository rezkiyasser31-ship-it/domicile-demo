const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let errors = 0;
  
  page.on('console', msg => {
      if (msg.type() === 'error') {
          console.error(`[Browser Error]: ${msg.text()}`);
          errors++;
      }
  });

  const fileUrl = `file:///${path.resolve(__dirname, 'admin.html').replace(/\\/g, '/')}`;
  await page.goto(fileUrl);
  
  // Wait for load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Check demo gate / badge
  const demoBadge = await page.locator('.demo-badge').count();
  if (demoBadge > 0) {
      console.log('Demo badge present.');
  } else {
      console.error('Demo badge NOT found.');
      errors++;
  }

  // Check charts render
  const canvases = await page.locator('canvas').count();
  if (canvases === 3) {
      console.log('All 3 charts rendered.');
  } else {
      console.error(`Expected 3 charts, found ${canvases}.`);
      errors++;
  }

  // Check date toggle
  const val30Btn = page.locator('button.date-range-btn[data-range="30"]');
  await val30Btn.click();
  await page.waitForTimeout(500);
  const visitsVal = await page.locator('#stat-visits-val').innerText();
  if (visitsVal === '4,890') {
      console.log('Date toggle working.');
  } else {
      console.error('Date toggle failed.');
      errors++;
  }

  // Click inventory tab
  await page.locator('button[data-target="inventory-tab"]').click();
  await page.waitForTimeout(500);

  // Check table sort
  const sortBtn = page.locator('th.sortable[data-sort="price"]');
  await sortBtn.click();
  await page.waitForTimeout(500);
  const firstPrice = await page.locator('#inventory-body tr:first-child td:nth-child(3)').innerText();
  console.log('First price after sort:', firstPrice);

  // Check i18n
  const enBtn = page.locator('.lang-switcher button[data-lang="en"]');
  await enBtn.click();
  await page.waitForTimeout(500);
  const title = await page.locator('h2').first().innerText();
  if (title === 'Dashboard') {
      console.log('i18n EN switch working.');
  } else {
      console.error('i18n failed, title is:', title);
      errors++;
  }

  await page.screenshot({ path: 'screenshot_desktop.png' });
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'screenshot_mobile.png' });
  
  await browser.close();

  if (errors > 0) {
      console.error(`Verification failed with ${errors} errors.`);
      process.exit(1);
  } else {
      console.log('Verification PASSED.');
  }
})();
