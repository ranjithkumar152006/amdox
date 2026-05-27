const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERR:', err));

  // Log in
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@erp.com');
  await page.fill('input[type="password"]', '1234');
  await page.click('button[type="submit"]');

  // Wait for Dashboard to load
  await page.waitForTimeout(1000);
  
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await btn.textContent();
    if (text.includes('Full System Report')) {
      console.log("Found Full System Report button");
      try {
        await btn.click({ timeout: 2000 });
        console.log("Full System Report button clicked!");
      } catch (e) {
        console.log("Failed to click:", e.message);
      }
    }
  }

  // Wait to see if toast appears
  await page.waitForTimeout(1200);
  const bodyText = await page.$eval('body', el => el.innerText);
  if (bodyText.includes('Full Enterprise Report Exported')) {
    console.log("Toast message appeared successfully.");
  } else {
    console.log("Toast message DID NOT appear.");
  }

  await browser.close();
})();
