const { chromium } = require('../原型/node_modules/playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', e => console.log('PageError:', e.message));
    page.on('console', msg => { if (msg.type() === 'error') console.log('Console:', msg.text().substring(0, 200)); });

    try {
        await page.goto('https://demo.ydt365.cn/gj/jiangxi/#/jiangxi', { timeout: 30000, waitUntil: 'networkidle' });
    } catch (e) {
        console.log('Nav error (continuing):', e.message.substring(0, 100));
    }
    
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'demo_site.png', fullPage: false });
    
    // Try to find thermometer-related elements
    const info = await page.evaluate(() => {
        const results = [];
        // Look for canvas elements
        document.querySelectorAll('canvas').forEach((c, i) => {
            const rect = c.getBoundingClientRect();
            if (rect.width > 100 && rect.height > 100) {
                results.push({ idx: i, w: Math.round(rect.width), h: Math.round(rect.height), x: Math.round(rect.x), y: Math.round(rect.y), id: c.id });
            }
        });
        // Look for elements with thermometer-related text
        const allText = [];
        document.querySelectorAll('div, span, h2, h3').forEach(el => {
            const text = el.textContent.trim();
            if (text.includes('温度计') || text.includes('温度') || text.includes('本月') || text.includes('趋势')) {
                const rect = el.getBoundingClientRect();
                allText.push({ text: text.substring(0, 50), x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), tag: el.tagName });
            }
        });
        return { canvases: results, texts: allText.slice(0, 20) };
    });
    console.log('Page info:', JSON.stringify(info, null, 2));
    
    await browser.close();
    console.log('Done');
})().catch(e => console.error(e.message));
