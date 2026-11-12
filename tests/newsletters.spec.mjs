import { test, expect, openPage } from './support/site.mjs';

// A fake api.myfi.ws for a signed-in user who manages one company, one domain, and one newsletter.
const CAMPAIGN = {
    id: 7, name: 'Welcome', subject: 'Welcome aboard', type: 'Delayed', delay: '0', queued: 0, sent: 0, updated: 'Today',
    body_html: '<p class="x">Hello "friend" & {APP_NAME}</p>', body_text: 'Hello friend', campaign_type: 'delayed', send_offset_minutes: 15,
};
const NEWSLETTER = {
    id: 3, name: 'Weekly Notes', key: '00000000-0000-4000-8000-000000000003', status: 'Active', subscribers: 2, pending: 1, created: 'Today',
    description: 'Notes <b>every</b> week.',
};
const report = (columns, items) => ({ page: 1, pageCount: 1, perPage: 10, total: items.length, columns, items });

async function mockApi(page) {
    const sent = [];
    await page.route('https://api.myfi.ws/**', async route => {
        const request = route.request();
        const url = new URL(request.url());
        const headers = { 'access-control-allow-origin': new URL(page.url()).origin, 'access-control-allow-credentials': 'true' };
        if (request.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: { ...headers, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        }
        const json = body => route.fulfill({ headers, contentType: 'application/json', body: JSON.stringify(body) });
        const path = url.pathname;
        if (request.method() !== 'GET' && path !== '/user/roles') sent.push({ method: request.method(), path, body: JSON.parse(request.postData() || '{}') });
        switch (path) {
            case '/user/roles': return route.fulfill({ headers, contentType: 'text/plain', body: '1' });
            case '/user/companies/options': return json([{ value: 1, display: 'Stoic Dreams' }]);
            case '/user/domains/options': return json([{ value: 2, display: 'Example' }]);
            case '/user/newsletters/options': return json([{ value: 3, display: 'Weekly Notes' }]);
            case '/user/newsletters': return json(report('Name|name;Key|key;Status|status', [NEWSLETTER]));
            case '/user/newsletter/campaigns': return json(report('Name|name;Subject|subject;Type|type', [CAMPAIGN]));
            case '/user/newsletter/subscribers': return json(report('Email|email;Status|status', [{ id: 1, email: 'j***@e***.com', status: 'Confirmed' }]));
            case '/user/newsletters/analytics': return json(report('Newsletter|name;Subscribers:|confirmed', [{ id: 3, name: 'Weekly Notes', confirmed: 2 }]));
            default: return route.fulfill({ headers, contentType: 'text/plain', body: 'Saved' });
        }
    });
    return sent;
}

async function openNewsletters(page) {
    const sent = await mockApi(page);
    // With one company and one domain, each dropdown writes the option it shows, which loads the next one and the report.
    await openPage(page, '/newsletters');
    await expect(page.locator('webui-report[api="/user/newsletters"]')).toContainText('Weekly Notes');
    return sent;
}

test('lists newsletters for the chosen domain', async ({ page }) => {
    await openNewsletters(page);
    const row = page.locator('webui-report[api="/user/newsletters"] tr', { hasText: 'Weekly Notes' });
    await expect(row).toContainText(NEWSLETTER.key);
    await expect(row).toContainText('Active');
});

test('the code dialog shows the signup form tag with the key', async ({ page }) => {
    await openNewsletters(page);
    await page.locator('webui-report[api="/user/newsletters"] webui-button[title="Signup Form Code"]').click();
    const dialog = page.locator('webui-dialogs dialog');
    await expect(dialog).toContainText(`<webui-newsletter key="${NEWSLETTER.key}"></webui-newsletter>`);
});

test('editing a newsletter fills the form from the row as text and saves it', async ({ page }) => {
    const sent = await openNewsletters(page);
    await page.locator('webui-report[api="/user/newsletters"] webui-button[title="Edit Weekly Notes"]').click();
    const dialog = page.locator('webui-dialogs dialog');
    await expect(dialog.getByLabel('Newsletter Name')).toHaveValue('Weekly Notes');
    await expect(dialog.getByLabel('Description')).toHaveValue(NEWSLETTER.description);
    await dialog.getByLabel('Newsletter Name').fill('Weekly Notes 2');
    await dialog.locator('#dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/newsletter')).toBeTruthy();
    const patch = sent.find(s => s.path === '/user/newsletter');
    expect(patch.method).toBe('PATCH');
    expect(patch.body).toMatchObject({ newsletterId: '3', name: 'Weekly Notes 2', description: NEWSLETTER.description });
});

test('adding a newsletter sends the domain', async ({ page }) => {
    const sent = await openNewsletters(page);
    await page.getByRole('button', { name: 'Add Newsletter' }).click();
    const dialog = page.locator('webui-dialogs dialog');
    await dialog.getByLabel('Newsletter Name').fill('Release News');
    await dialog.locator('#dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/newsletter/create')).toBeTruthy();
    expect(sent.find(s => s.path === '/user/newsletter/create').body).toMatchObject({ domainId: '2', name: 'Release News' });
});

test('editing a campaign keeps its HTML body exactly and sends every field', async ({ page }) => {
    const sent = await openNewsletters(page);
    await page.locator('webui-tabs').getByRole('button', { name: 'Campaigns', exact: true }).click();
    const campaigns = page.locator('webui-report[api="/user/newsletter/campaigns"]');
    await expect(campaigns).toContainText('Welcome aboard');
    await campaigns.locator('webui-button[title="Edit Welcome"]').click();
    const dialog = page.locator('webui-dialogs dialog');
    await expect(dialog.getByLabel('Email Body (HTML)')).toHaveValue(CAMPAIGN.body_html);
    await expect(dialog.getByLabel('Email Subject')).toHaveValue('Welcome aboard');
    await expect(dialog.locator('select[name="campaignType"]')).toHaveValue('delayed');
    await expect(dialog.getByLabel('Delay in minutes (Delayed only)')).toHaveValue('15');
    await dialog.locator('#dlg-confirm').click();
    await expect.poll(() => sent.find(s => s.path === '/user/newsletter/campaign')).toBeTruthy();
    expect(sent.find(s => s.path === '/user/newsletter/campaign').body).toEqual({
        campaignId: '7', name: 'Welcome', subject: 'Welcome aboard', bodyHtml: CAMPAIGN.body_html, bodyText: 'Hello friend',
        campaignType: 'delayed', sendOffsetMinutes: '15',
    });
});

test('subscribers and analytics load for the chosen newsletter and domain', async ({ page }) => {
    await openNewsletters(page);
    await page.locator('webui-tabs').getByRole('button', { name: 'Subscribers', exact: true }).click();
    await expect(page.locator('webui-report[api="/user/newsletter/subscribers"]')).toContainText('j***@e***.com');
    await page.locator('webui-tabs').getByRole('button', { name: 'Analytics', exact: true }).click();
    await expect(page.locator('webui-report[api="/user/newsletters/analytics"]')).toContainText('Weekly Notes');
});

test('the confirm page asks for a click before confirming', async ({ page }) => {
    const sent = await mockApi(page);
    await openPage(page, '/newsletter/confirm?token=abc');
    const button = page.getByRole('button', { name: 'Confirm my subscription' });
    await expect(button).toBeVisible();
    expect(sent.some(s => s.path === '/newsletter/confirm')).toBe(false);
    await button.click();
    await expect.poll(() => sent.find(s => s.path === '/newsletter/confirm')?.body).toEqual({ token: 'abc' });
});

test('the unsubscribe page posts the token', async ({ page }) => {
    const sent = await mockApi(page);
    await openPage(page, '/newsletter/unsubscribe?token=xyz');
    await page.getByRole('button', { name: 'Unsubscribe' }).click();
    await expect.poll(() => sent.find(s => s.path === '/newsletter/unsubscribe')?.body).toEqual({ token: 'xyz' });
});
