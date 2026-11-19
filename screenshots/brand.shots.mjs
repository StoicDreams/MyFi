import { test, ROOT_FILES, readJson } from '../tests/support/site.mjs';
import { join } from 'node:path';

// Renders the 1200x630 image shared links show (og:image) from webapp/root_files/Logo.svg, the site name in
// appConfig.json, and the theme colors in webapp/css/app.css, so it always matches them. Social sites don't preview
// SVG images, so the share image has to be a PNG. Only the tagline and file name differ between sites.
// Run it with PowerShell/screenshots.ps1, or npm run screenshots, after changing the logo, name, palette, or tagline.

const TAGLINE = "Backend-as-a-Service for developers who build with purpose";
const FILE = "myfi-share.png";

test('share image for links', async ({ page }) => {
    const { appName } = readJson(join(ROOT_FILES, 'appConfig.json'));
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto('/');
    // The site's own colors, as the browser works them out from its stylesheets.
    const colors = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        const get = name => style.getPropertyValue(name).trim();
        return { background: get('--color-background'), text: get('--color-background-offset'), title: get('--color-title') };
    });
    await page.setContent(`<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;display:flex;align-items:center;gap:64px;padding:0 88px;
background:${colors.background};border-bottom:24px solid ${colors.title};font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;color:${colors.text}">
<img src="/Logo.svg" alt="" style="width:320px;height:320px;flex:none">
<div>
<div class="name" style="font-size:${appName.length > 20 ? 64 : 88}px;font-weight:800;line-height:1.1"></div>
<div class="tagline" style="font-size:40px;margin-top:24px;font-weight:700"></div>
</div>
</div></body></html>`);
    await page.locator('.name').evaluate((el, text) => { el.innerText = text; }, appName);
    await page.locator('.tagline').evaluate((el, text) => { el.innerText = text; }, TAGLINE);
    await page.locator('img').evaluate(img => img.decode());
    await page.screenshot({ path: join(ROOT_FILES, 'img', FILE) });
});
