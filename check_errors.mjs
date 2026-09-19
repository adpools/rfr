import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));
  
  console.log("Navigating to localhost:5174...");
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' }).catch(err => console.log("Navigation error:", err));
  
  await browser.close();
  console.log("Done.");
})();
