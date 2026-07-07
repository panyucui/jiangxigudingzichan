const { chromium } = require('../原型/node_modules/playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', e => console.log('PageError:', e.message));

    await page.goto('https://demo.ydt365.cn/gj/jiangxi/#/jiangxi', { timeout: 15000, waitUntil: 'domcontentloaded' }).catch(e => console.log('Nav error:', e.message));
    await page.waitForTimeout(5000);

    // Try to find and screenshot the thermometer area
    await page.screenshot({ path: 'demo_full.png', fullPage: false });

    // Also try to find the thermometer element
    const thermInfo = await page.evaluate(() => {
        // Look for canvas elements or thermometer-related elements
        const canvases = document.querySelectorAll('canvas');
        const results = [];
        canvases.forEach((c, i) => {
            const rect = c.getBoundingClientRect();
            results.push({ idx: i, w: rect.width, h: rect.height, x: rect.x, y: rect.y, id: c.id, class: c.className });
        });
        return results;
    });
    console.log('Canvas elements:', JSON.stringify(thermInfo, null, 2));

    await browser.close();
    console.log('Done');
})().catch(e => console.error(e.message));
