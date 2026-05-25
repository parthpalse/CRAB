import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 320, height: 568 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  // Wait for the splash to fade
  await page.waitForTimeout(4000);
  // Full page screenshot
  await page.screenshot({ path: 'screenshot-320.png', fullPage: false });
  // Navbar-only screenshot
  const nav = await page.$('nav');
  if (nav) {
    await nav.screenshot({ path: 'screenshot-320-nav.png' });
  }
  console.log('Screenshots saved: screenshot-320.png, screenshot-320-nav.png');
  await browser.close();
})();
