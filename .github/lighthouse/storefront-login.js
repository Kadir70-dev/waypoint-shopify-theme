// LHCI puppeteerScript: runs in Lighthouse's own browser before each audit.
// Logs in to the password-protected storefront only when the page actually
// lands on /password; once the session cookie exists in this browser, later
// calls skip the form. The password comes from the SHOP_PASSWORD env var and
// is never written to disk or logged.
module.exports = async (browser, context) => {
  const page = await browser.newPage();
  try {
    await page.goto(context.url, { waitUntil: 'domcontentloaded' });
    if (!new URL(page.url()).pathname.startsWith('/password')) {
      console.error('Storefront already unlocked — login skipped.');
      return;
    }
    const field = 'form[action*="password"] input[type="password"]';
    await page.waitForSelector(field, { timeout: 15000 });
    await page.type(field, process.env.SHOP_PASSWORD || '');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.$eval('form[action*="password"]', (form) => form.submit()),
    ]);
    if (new URL(page.url()).pathname.startsWith('/password')) {
      throw new Error('Storefront password was not accepted.');
    }
    console.error('Storefront unlocked.');
  } finally {
    await page.close();
  }
};
