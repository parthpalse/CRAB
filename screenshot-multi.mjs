import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 375px screenshot
  const ctx375 = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
  });
  const page375 = await ctx375.newPage();
  await page375.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page375.waitForTimeout(4000);
  await page375.screenshot({ path: 'screenshot-375.png', fullPage: false });
  const nav375 = await page375.$('nav');
  if (nav375) await nav375.screenshot({ path: 'screenshot-375-nav.png' });
  
  // 390px screenshot (iPhone 14)
  const ctx390 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page390 = await ctx390.newPage();
  await page390.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page390.waitForTimeout(4000);
  await page390.screenshot({ path: 'screenshot-390.png', fullPage: false });
  const nav390 = await page390.$('nav');
  if (nav390) await nav390.screenshot({ path: 'screenshot-390-nav.png' });
  
  // 428px screenshot (iPhone 14 Pro Max)
  const ctx428 = await browser.newContext({
    viewport: { width: 428, height: 926 },
    deviceScaleFactor: 2,
  });
  const page428 = await ctx428.newPage();
  await page428.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page428.waitForTimeout(4000);
  await page428.screenshot({ path: 'screenshot-428.png', fullPage: false });
  const nav428 = await page428.$('nav');
  if (nav428) await nav428.screenshot({ path: 'screenshot-428-nav.png' });

  console.log('All screenshots saved');
  await browser.close();
})();
