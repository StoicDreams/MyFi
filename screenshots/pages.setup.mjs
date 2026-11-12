import { expect } from '../tests/support/site.mjs';

// My Fidelity's setup for screenshots/pages.shots.mjs. The management pages show a sample account, so the pictures show
// the service in use rather than empty tables. The answers match what the database functions in Apis/Databases return.
// Everything is made up and answered here, so nothing reaches api.myfi.ws or a real account.

const when = (day, time) => `November ${String(day).padStart(2, '0')}, 2026 ${time} UTC`;
const report = (columns, items) => ({ page: 1, pageCount: 1, perPage: 10, total: items.length, columns, items });

const companies = [
    { id: 1, name: 'Acme Studio', created: when(2, '09:15 AM'), updated: when(2, '09:15 AM') },
    { id: 2, name: 'Northwind Apps', created: when(1, '04:40 PM'), updated: when(2, '11:05 AM') },
];
const domains = [
    { id: 11, name: 'Acme Studio', domain: 'www.acmestudio.example', created: when(2, '09:20 AM'), updated: when(2, '09:20 AM') },
    { id: 12, name: 'Acme Shop', domain: 'shop.acmestudio.example', created: when(2, '09:32 AM'), updated: when(2, '10:01 AM') },
];
const pendingDomains = [
    { id: 13, name: 'Acme Docs', domain: 'docs.acmestudio.example', key: '7f3c9a1e-5b2d-4c8e-9a6f-2d1b0c4e8f37', created: when(2, '01:10 PM'), updated: when(2, '01:10 PM') },
];
const feedback = [
    ['Jordan', 'The checkout page took a long time to load on my phone this morning.', '08:12 AM'],
    ['Guest', 'Love the new dark theme. Could the font be a little larger?', '10:47 AM'],
    ['Priya', 'The download link in the welcome email goes to a page that is not found.', '01:30 PM'],
].map(([user, message, time], index) => ({ id: 21 + index, user, message: message.slice(0, 10), fullmessage: message, created: when(2, time), updated: when(2, time) }));
const feedbackCounts = [
    { company: 'Acme Studio', domain: 'Acme Studio', count: 3, latest: when(2, '01:30 PM') },
    { company: 'Acme Studio', domain: 'Acme Shop', count: 1, latest: when(1, '03:05 PM') },
];
const newsletters = [
    { id: 31, name: 'Studio Notes', key: '3b8e4f2a-1c6d-4e9b-8a7f-5d2c1b0e9a43', status: 'Active', subscribers: 248, pending: 6, created: when(2, '09:40 AM'), description: 'What we shipped this month.' },
    { id: 32, name: 'Release News', key: '9d1a7c3e-2f4b-4a8d-b6e5-0c3f2a1d8b76', status: 'Inactive', subscribers: 0, pending: 0, created: when(2, '02:15 PM'), description: '' },
];

const answers = {
    '/user/companies/options': () => companies.map(c => ({ value: c.id, display: c.name })),
    '/user/domains/options': () => domains.map(d => ({ value: d.id, display: d.name })),
    '/user/newsletters/options': () => newsletters.map(n => ({ value: n.id, display: n.name })),
    '/user/companies': () => report('Name|name;Created:|created;Last Updated:|updated', companies),
    '/user/domains': () => report('Name|name;Domain|domain;Created:|created;Last Updated:|updated', domains),
    '/user/domains/pending': () => report('Name|name;Domain|domain;Created:|created;Last Updated:|updated', pendingDomains),
    '/user/feedback': () => report('User|user;Message|message;Created:|created;Last Updated:|updated', feedback),
    '/user/feedback/counts': () => report('Company|company;Domain|domain;Count:|count;Latest:|latest', feedbackCounts),
    '/user/newsletters': () => report('Name|name;Key|key;Status|status;Subscribers:|subscribers;Pending:|pending;Created:|created', newsletters),
    '/user/newsletter/campaigns': () => report('Name|name;Subject|subject;Type|type;Delay (minutes):|delay;Queued:|queued;Sent:|sent;Updated:|updated', [
        { id: 41, name: 'Welcome', subject: 'Welcome to Studio Notes', type: 'Delayed', delay: 0, queued: 2, sent: 0, updated: when(2, '09:45 AM'), body_html: '', body_text: '', campaign_type: 'delayed', send_offset_minutes: 0 },
    ]),
    '/user/newsletter/subscribers': () => report('Email|email;Status|status;Signed Up:|created;Confirmed:|confirmed', [
        { id: 51, email: 'j***@e***.com', status: 'Confirmed', created: when(1, '08:00 AM'), confirmed: when(1, '08:03 AM') },
    ]),
    '/user/newsletters/analytics': () => report('Newsletter|name;Subscribers:|confirmed;Pending:|pending;Unsubscribed:|unsubscribed;New (30 days):|recent;Emails Queued:|queued;Emails Sent:|sent;Emails Failed:|failed', [
        { id: 31, name: 'Studio Notes', confirmed: 248, pending: 6, unsubscribed: 9, recent: 37, queued: 2, sent: 0, failed: 0 },
        { id: 32, name: 'Release News', confirmed: 0, pending: 0, unsubscribed: 0, recent: 0, queued: 0, sent: 0, failed: 0 },
    ]),
};

// Text each page shows once its sample data has loaded.
const loaded = {
    '/companies': 'Northwind Apps',
    '/domains': 'docs.acmestudio.example',
    '/feedback': 'Jordan',
    '/newsletters': 'Studio Notes',
};

export async function setup(page, route) {
    if (!loaded[route]) return;
    // Added after the shared signIn, so this handler sees API requests first and passes on the roles request.
    await page.route('https://api.myfi.ws/**', route => {
        const request = route.request();
        const answer = answers[new URL(request.url()).pathname];
        if (!answer) return route.fallback();
        const origin = request.headers().origin || new URL(page.url()).origin;
        const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true' };
        if (request.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: { ...headers, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        }
        return route.fulfill({ headers, contentType: 'application/json', body: JSON.stringify(answer()) });
    });
}

export async function prepare(page, route) {
    const text = loaded[route];
    if (text) await expect(page.locator('webui-app')).toContainText(text);
}
