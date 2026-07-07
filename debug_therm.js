const { chromium } = require('../原型/node_modules/playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    const filePath = 'file:///' + path.resolve('江西数字大屏.html').split('\\').join('/');

    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text().substring(0, 200) }));
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));

    await page.goto(filePath, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(5000);

    // Click the "历史趋势" tab to switch to history view
    await page.click('.therm-tab[data-view="history"]').catch(() => {});
    await page.waitForTimeout(1000);

    const echartsStatus = await page.evaluate(() => {
        return {
            echartsExists: typeof echarts !== 'undefined',
            chartThermSize: document.getElementById('chart-therm')?.getBoundingClientRect(),
        };
    });
    console.log('Status:', JSON.stringify(echartsStatus, null, 2));

    if (pageErrors.length > 0) {
        console.log('Errors:', pageErrors);
    }

    await page.screenshot({ path: 'debug_therm.png', fullPage: false });
    await browser.close();
})().catch(e => console.error(e.message));
