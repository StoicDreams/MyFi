import { test, expect, openPage } from './support/site.mjs';

// A fake api.myfi.ws for a signed-in user whose company has one sending address.
const report = (columns, items) => ({ page: 1, pageCount: 1, perPage: 10, total: items.length, columns, items });
const SENDER = {
    id: 61, label: 'Newsletters', address: 'n***@e***.com', server: 'smtp.example.com:587 (STARTTLS)', status: 'Needs attention',
    details: 'The mail server refused the username or password: 535 Authentication failed', limits: '100 an hour, 500 a day',
    smtp_host: 'smtp.example.com', smtp_port: 587, smtp_security: 'starttls', hourly_limit: 100, daily_limit: 500, sent: 0, failed: 2, newsletters: 1,
};

async function openSenders(page) {
    const sent = [];
    await page.route('https://api.myfi.ws/**', async route => {
        const request = route.request();
        const url = new URL(request.url());
        const headers = { 'access-control-allow-origin': new URL(page.url()).origin, 'access-control-allow-credentials': 'true' };
        if (request.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: { ...headers, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        }
        if (request.method() !== 'GET' && url.pathname !== '/user/roles') sent.push({ method: request.method(), path: url.pathname, body: JSON.parse(request.postData() || '{}') });
        const json = body => route.fulfill({ headers, contentType: 'application/json', body: JSON.stringify(body) });
        switch (url.pathname) {
            case '/user/roles': return route.fulfill({ headers, contentType: 'text/plain', body: '1' });
            case '/user/companies/options': return json([{ value: 1, display: 'Stoic Dreams' }]);
            case '/user/email/credentials': return json(report('Name|label;Address|address;Status|status;Details|details', [SENDER]));
            default: return route.fulfill({ headers, contentType: 'text/plain', body: 'Saved' });
        }
    });
    await openPage(page, '/senders');
    await expect(page.locator('webui-report[api="/user/email/credentials"]')).toContainText('Newsletters');
    return sent;
}

test('the report shows each address masked, with its status and the reason', async ({ page }) => {
    await openSenders(page);
    const table = page.locator('webui-report[api="/user/email/credentials"]');
    await expect(table).toContainText('n***@e***.com');
    await expect(table).toContainText('Needs attention');
    await expect(table).toContainText('535 Authentication failed');
});

test('adding an address sends every field for the API to encrypt', async ({ page }) => {
    const sent = await openSenders(page);
    await page.getByRole('button', { name: 'Add Sending Address' }).click();
    const dialog = page.locator('webui-dialogs');
    await dialog.getByLabel('Name', { exact: true }).fill('Newsletters');
    await dialog.getByLabel('Email Address').fill('news@example.com');
    await dialog.getByLabel('SMTP Server').fill('smtp.example.com');
    await dialog.getByLabel('Username').fill('news@example.com');
    await dialog.getByLabel('Password').fill('app-password');
    await expect(dialog.getByLabel('Password')).toHaveAttribute('type', 'password');
    await dialog.locator('#dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/email/credential/create')).toBeTruthy();
    expect(sent.find(s => s.path === '/user/email/credential/create').body).toEqual({
        companyId: '1', label: 'Newsletters', email: 'news@example.com', smtpHost: 'smtp.example.com', smtpPort: '587',
        smtpSecurity: 'starttls', smtpUsername: 'news@example.com', smtpPassword: 'app-password', hourlyLimit: '100', dailyLimit: '500',
    });
});

test('editing an address starts from its settings, with the sign-in left empty to keep it', async ({ page }) => {
    const sent = await openSenders(page);
    await page.locator('webui-report[api="/user/email/credentials"] webui-button[title="Edit Newsletters"]').click();
    const dialog = page.locator('webui-dialogs');
    await expect(dialog.getByLabel('SMTP Server')).toHaveValue('smtp.example.com');
    await expect(dialog.getByLabel('Hourly Limit')).toHaveValue('100');
    await expect(dialog.getByLabel('Password')).toHaveValue('');
    await dialog.getByLabel('Daily Limit').fill('400');
    await dialog.locator('#dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/email/credential')).toBeTruthy();
    const patch = sent.find(s => s.path === '/user/email/credential');
    expect(patch.method).toBe('PATCH');
    expect(patch.body).toMatchObject({ credentialId: '61', label: 'Newsletters', smtpHost: 'smtp.example.com', smtpPort: '587', smtpSecurity: 'starttls', smtpUsername: '', smtpPassword: '', hourlyLimit: '100', dailyLimit: '400' });
});

test('an address can be checked again, and deleted', async ({ page }) => {
    const sent = await openSenders(page);
    const table = page.locator('webui-report[api="/user/email/credentials"]');
    await table.locator('webui-button[title="Check Newsletters Again"]').click();
    await page.locator('webui-dialogs #dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/email/credential/check')?.body).toEqual({ credentialId: '61' });
    await table.locator('webui-button[title="Delete Newsletters"]').click();
    await page.locator('webui-dialogs #dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/email/credential' && s.method === 'DELETE')?.body).toEqual({ credentialId: '61' });
});
