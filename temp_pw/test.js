const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERR:', err));
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  const btn = await page.$('button[type="submit"]');
  if (btn) {
    console.log("Button found");
    try {
      await btn.click({ timeout: 2000 });
      console.log("Button clicked");
    } catch(e) {
      console.log("Click failed:", e.message);
    }
  } else {
    console.log("Button not found");
  }
  await browser.close();
})();
