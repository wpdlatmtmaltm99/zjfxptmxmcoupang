const { chromium } = require('playwright');
const fs = require('fs');

const url = 'https://link.coupang.com/a/etLbJZ';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const context = await browser.newContext({
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    viewport: { width: 1440, height: 1200 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });

  const page = await context.newPage();

  try {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await page.waitForTimeout(8000);

    const finalUrl = page.url();
    const status = response ? response.status() : 'NO_RESPONSE';
    const html = await page.content();

    await page.screenshot({
      path: 'screenshot.png',
      fullPage: true
    });

    fs.writeFileSync('final.html', html, 'utf8');
    fs.writeFileSync(
      'final-url.txt',
      `status=${status}\nfinalUrl=${finalUrl}\n`,
      'utf8'
    );

    console.log('status:', status);
    console.log('finalUrl:', finalUrl);
    console.log('html length:', html.length);
  } catch (err) {
    fs.writeFileSync('final.html', String(err), 'utf8');
    fs.writeFileSync('final-url.txt', 'FAILED\n', 'utf8');
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
