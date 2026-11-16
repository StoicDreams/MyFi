import { test, expect, openPage } from './support/site.mjs';

// A fake api.myfi.ws for a signed-in user who owns one company.
const report = (columns, items) => ({ page: 1, pageCount: 1, perPage: 10, total: items.length, columns, items });
const COMPANY = { id: 1, name: 'Acme Studio', address: '123 Main Street\nSpringfield, IL 62701', created: 'Today', updated: 'Today' };

async function openCompanies(page) {
    const sent = [];
    await page.route('https://api.myfi.ws/**', async route => {
        const request = route.request();
        const url = new URL(request.url());
        const headers = { 'access-control-allow-origin': new URL(page.url()).origin, 'access-control-allow-credentials': 'true' };
        if (request.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: { ...headers, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        }
        if (request.method() !== 'GET' && url.pathname !== '/user/roles') sent.push({ method: request.method(), path: url.pathname, body: JSON.parse(request.postData() || '{}') });
        switch (url.pathname) {
            case '/user/roles': return route.fulfill({ headers, contentType: 'text/plain', body: '1' });
            case '/user/companies': return route.fulfill({ headers, contentType: 'application/json', body: JSON.stringify(report('Name|name;Postal Address|address;Created:|created;Last Updated:|updated', [COMPANY])) });
            default: return route.fulfill({ headers, contentType: 'text/plain', body: 'Saved' });
        }
    });
    await openPage(page, '/companies');
    await expect(page.locator('webui-report[api="/user/companies"]')).toContainText('Acme Studio');
    return sent;
}

test('the companies report shows each company postal address', async ({ page }) => {
    await openCompanies(page);
    await expect(page.locator('webui-report[api="/user/companies"]')).toContainText('123 Main Street');
});

test('the postal address dialog starts with the saved address and saves the new one', async ({ page }) => {
    const sent = await openCompanies(page);
    await page.locator('webui-report[api="/user/companies"] webui-button[title="Postal Address for Acme Studio"]').click();
    const dialog = page.locator('webui-dialogs');
    const address = dialog.getByLabel('Postal Address', { exact: true });
    await expect(address).toHaveValue(COMPANY.address);
    await address.fill('PO Box 42\nSpringfield, IL 62701');
    await dialog.locator('#dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/company/address')).toBeTruthy();
    const patch = sent.find(s => s.path === '/user/company/address');
    expect(patch.method).toBe('PATCH');
    expect(patch.body).toEqual({ companyId: '1', address: 'PO Box 42\nSpringfield, IL 62701' });
});
