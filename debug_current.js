const { chromium } = require('../原型/node_modules/playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    const filePath = 'file:///' + path.resolve('江西数字大屏.html').split('\\').join('/');

    page.on('pageerror', e => console.log('Error:', e.message));

    await page.goto(filePath, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Make sure "本月数值" tab is active (default)
    await page.click('.therm-tab[data-view="current"]').catch(() => {});
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'debug_current.png', fullPage: false });
    await browser.close();
    console.log('Done');
})().catch(e => console.error(e.message));
