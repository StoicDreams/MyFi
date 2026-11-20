<webui-data data-page-title="Newsletter Management" data-page-subtitle="" data-page-description="Add newsletters to your domains, place the signup form on your site, and write the campaigns and email series sent to your subscribers."></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            Newsletters let visitors to your websites sign up for email from you, and let you write the emails they receive. Add a newsletter to one of your domains, put its signup form on your site, then write campaigns: emails sent once to everyone, or a series sent to each subscriber after they sign up. My Fidelity handles the rest, from confirming each signup to the unsubscribe link and legal details in every email, so you only write your own content.
        </webui-page-segment>
        <webui-page-help heading="Newsletters Guide" storage-key="myfi-newsletters-help">
            <webui-tabs theme="info">
                <webui-button slot="tabs">Getting Started</webui-button>
                <webui-content slot="content" nodetach>

1. **Choose a company and domain** at the top of the page. A newsletter belongs to one of your verified domains, from the Domains page.
2. **Add a newsletter** with a name and a description. Visitors see both above the signup form.
3. **Check its status** in the Newsletters tab. It takes signups once it is Active.
4. **Choose its sending address** with the envelope button on its row. Add your own email account on the [Sending Addresses](/senders) page first.
5. **Put the signup form on your site** with the code button on its row. It only works on that domain.
6. **Write campaigns** in the Campaigns tab, and watch subscribers arrive in the Subscribers tab.

                </webui-content>
                <webui-button slot="tabs">Status and Plans</webui-button>
                <webui-content slot="content" nodetach>

Newsletters are a paid service. Each active newsletter uses one slot in the newsletter plan of the company's owner, and every plan includes unlimited campaigns and subscribers.

- **Active:** takes signups and sends campaigns.
- **Needs a newsletter plan:** there is no free slot in the plan. Its signup form is hidden until there is one.
- **Needs a company address:** it takes signups, but campaigns wait until the company has a postal address, which the law requires in every newsletter email. Add one on the Companies page.
- **Needs a sending address:** it takes signups, but campaigns wait until you choose one of your [sending addresses](/senders) for it, and that address is Ready.
- **Paused:** you paused it. Its signup form is hidden and its campaigns wait, but its subscribers and campaigns are kept.

If a plan has fewer slots than newsletters, such as after a downgrade, the oldest newsletters stay active. Pause one to free its slot for another, and resume it when a slot is free.

                </webui-content>
                <webui-button slot="tabs">Campaigns</webui-button>
                <webui-content slot="content" nodetach>

A campaign is one email. Write a subject and a body, and the preview beside them shows the email as subscribers will receive it.

- **Draft** campaigns are never sent, so you can work on them over time.
- **Immediate** campaigns go once to everyone subscribed when they are queued, a few minutes after you save. They can't be changed after that.
- **Delayed** campaigns go to each subscriber a set number of minutes after they confirm, such as 0 for a welcome email or 10080 for one a week later. Several delayed campaigns make a series.

You only write your own content. Every email gets a header naming the newsletter and your company, and a footer saying why the subscriber is getting it, with an unsubscribe link and your company's postal address.

                </webui-content>
                <webui-button slot="tabs">Sending</webui-button>
                <webui-content slot="content" nodetach>

Campaign emails are sent from your own email account, chosen with the envelope button on the newsletter's row, so subscribers see your address and their replies come to you. Add accounts on the [Sending Addresses](/senders) page.

- Each address sends no more than its hourly and daily limits, so your provider never blocks it. Emails over the limit wait their turn.
- Nobody gets the same campaign twice.
- When a mail server asks to try later, the email is sent again after 5 minutes, 15 minutes, 1 hour, and 4 hours.
- The **Delivery Problems** report in the Analytics tab lists every failed attempt, with the mail server's reason.

                </webui-content>
                <webui-button slot="tabs">Subscribers</webui-button>
                <webui-content slot="content" nodetach>

Everyone who signs up gets an email asking them to confirm, so nobody is subscribed by someone else. Only confirmed subscribers receive campaigns.

- **Pending:** signed up, but hasn't confirmed. Unconfirmed signups are removed after 7 days.
- **Confirmed:** receives your campaigns.
- **Unsubscribed:** used the link in an email, and receives nothing more.

Email addresses are partly hidden, because Stoic Dreams keeps subscribers' personal data private. They are stored encrypted, and only decrypted to send.

                </webui-content>
            </webui-tabs>
        </webui-page-help>
        <webui-page-segment elevation="10">
            <webui-flex gap="3" class="container" wrap-at="600">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-newsletter.companyId" api="user/companies/options"></webui-dropdown>
                <webui-dropdown label="Domain" data-subscribe="session-domain-id|filter-newsletter.companyId:loadData" data-trigger="session-domain-id|filter-newsletter.domainId" data-api="filter-newsletter" api="user/domains/options" data-fields="companyId"></webui-dropdown>
                <webui-flex align="center" justify="right">
                    <webui-button data-trigger="page-newsletter-create" data-value="1">Add Newsletter</webui-button>
                </webui-flex>
            </webui-flex>
            <webui-dialog-action title="Add Newsletter" confirm="Add Newsletter" api="post|/user/newsletter/create" data-subscribe="page-newsletter-create" data-success="refresh-newsletters">
                <template>
                    <webui-page-segment>
                        Create a newsletter for this domain. Visitors see its name and description above the signup form, unless your site provides its own text, so say what they will receive and how often.
                    </webui-page-segment>
                    <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                    <webui-input-text label="Newsletter Name" name="name" placeholder="Your Newsletter Name" maxlength="100"></webui-input-text>
                    <webui-input-message label="Description" name="description" placeholder="Tell visitors what they will receive and how often" maxlength="2000"></webui-input-message>
                    <webui-quote theme="info">
                        Each active newsletter uses one slot in your newsletter plan. A newsletter starts taking signups once it is Active, which the Newsletters tab shows.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-tabs theme="secondary" index="0" transition-timing="200" data-subscribe="session-newsletters-tab-index:setTab">
            <webui-button align="left" slot="tabs">Newsletters</webui-button>
            <webui-content slot="content" theme="default">
                <webui-page-segment>
                    The newsletters on this domain. **Status** shows whether each one is taking signups and sending: open the help for what each status means. **Sends From** is the address its campaigns are sent from. Use the buttons on a row to get its signup form code, edit it, choose its sending address, pause or resume it, or delete it.
                </webui-page-segment>
                <webui-report label="Newsletters" api="/user/newsletters" filters="filter-newsletter" required-filters="companyId;domainId" sort-column="name" bordered theme="info" data-subscribe="filter-newsletter:loadData|refresh-newsletters:loadData" append-columns=":Actions:" sortable="name;status;subscribers;pending;created">
                <template slot="column" name="actions">
                    <webui-button theme="tertiary" start-icon="code" title="Signup Form Code" data-trigger="page-newsletter-{_ROWID}-code"></webui-button>
                    <webui-button theme="info" start-icon="pencil|shade:tri" title="Edit {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-update"></webui-button>
                    <webui-button theme="secondary" start-icon="envelope" title="Sending Address for {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-sender" data-value="1"></webui-button>
                    <webui-condition data-subscribe="page-tr-{_ROWID}.paused">
                        <template slot="valid">
                            <webui-button theme="success" start-icon="play" title="Resume {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-resume" data-value="1"></webui-button>
                        </template>
                        <template slot="invalid">
                            <webui-button theme="warning" start-icon="pause" title="Pause {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-pause" data-value="1"></webui-button>
                        </template>
                    </webui-condition>
                    <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Signup Form for {TEMPLATE_NAME}" confirm="Close" data-subscribe="page-newsletter-{_ROWID}-code">
                        <template>
                            <webui-page-segment>
                                Add this to any page of the newsletter's domain to show its signup form. It only works on that domain, and it hides itself while the newsletter isn't taking signups.
                            </webui-page-segment>
                            <webui-code language="html" label="Signup form">&lt;webui-newsletter key="{TEMPLATE_KEY}"&gt;&lt;/webui-newsletter&gt;</webui-code>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Edit {TEMPLATE_NAME}" confirm="Save Newsletter" api="patch|/user/newsletter" data-subscribe="page-newsletter-{_ROWID}-update" data-success="refresh-newsletters">
                        <template>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <webui-input-text label="Newsletter Name" name="name" maxlength="100" data-subscribe="page-tr-{_ROWID}.name"></webui-input-text>
                            <webui-input-message label="Description" name="description" maxlength="2000" data-subscribe="page-tr-{_ROWID}.description"></webui-input-message>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Sending Address for {TEMPLATE_NAME}" confirm="Save" api="patch|/user/newsletter/sender" data-subscribe="page-newsletter-{_ROWID}-sender" data-success="refresh-newsletters">
                        <template>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <webui-page-segment>
                                Choose the address {TEMPLATE_NAME}'s campaigns are sent from. Its campaigns are sent once the address is Ready. Add or check addresses on the [Sending Addresses](/senders) page.
                            </webui-page-segment>
                            <webui-dropdown label="Send from" newid="0" newlabel="None: campaigns wait" api="user/email/credentials/options" data-api="filter-newsletter" data-fields="companyId" data-subscribe="page-tr-{_ROWID}.credential_id" data-trigger="page-newsletter-{_ROWID}-credential"></webui-dropdown>
                            <input type="hidden" name="credentialId" data-subscribe="page-newsletter-{_ROWID}-credential" />
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Pause {TEMPLATE_NAME}" confirm="Pause Newsletter" api="post|/user/newsletter/pause" data-subscribe="page-newsletter-{_ROWID}-pause" data-success="refresh-newsletters">
                        <template>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <webui-page-segment>
                                Pausing frees this newsletter's slot in your plan for another newsletter. While it is paused, its signup form is hidden and its campaigns wait. Its subscribers and campaigns are kept, and you can resume it whenever your plan has a free slot.
                            </webui-page-segment>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Resume {TEMPLATE_NAME}" confirm="Resume Newsletter" api="post|/user/newsletter/resume" data-subscribe="page-newsletter-{_ROWID}-resume" data-success="refresh-newsletters">
                        <template>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <webui-page-segment>
                                Resuming uses a free slot in your newsletter plan. If every slot is in use, pause another newsletter first.
                            </webui-page-segment>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete Newsletter" api="delete|/user/newsletter" data-subscribe="page-newsletter-{_ROWID}-delete" data-success="refresh-newsletters">
                        <template>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <webui-quote theme="danger">
                                This deletes {TEMPLATE_NAME} with all of its campaigns and subscribers. It can't be undone, and its signup forms stop working. To stop it for now and keep everything, pause it instead.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
                </webui-report>
            </webui-content>
            <webui-button align="left" slot="tabs">Campaigns</webui-button>
            <webui-content slot="content" theme="default">
                <webui-page-segment>
                    Campaigns are the emails a newsletter sends. Pick a newsletter, then add a campaign or edit one. The editor shows a preview of each email as subscribers will receive it.
                </webui-page-segment>
                <webui-page-segment>
                    <webui-flex gap="3" wrap-at="600">
                        <webui-dropdown label="Newsletter" data-subscribe="session-newsletter-id|filter-newsletter.domainId:loadData|refresh-newsletters:loadData" data-trigger="session-newsletter-id|filter-newsletter-campaigns.newsletterId|filter-newsletter-subscribers.newsletterId" data-api="filter-newsletter" api="user/newsletters/options" data-fields="domainId"></webui-dropdown>
                        <webui-flex align="center" justify="right">
                            <webui-button data-trigger="page-news-campaign-create|page-news-draft-new" data-value="1">Add Campaign</webui-button>
                        </webui-flex>
                    </webui-flex>
                </webui-page-segment>
                <webui-dialog-action title="Add Campaign" confirm="Add Campaign" api="post|/user/newsletter/campaign/create" data-subscribe="page-news-campaign-create" data-success="refresh-news-campaigns">
                    <template>
                        <input type="hidden" name="newsletterId" data-subscribe="session-newsletter-id" />
                        <!-- What must be filled in comes first, where it shows without scrolling. The two bodies and the preview keep to the height of the window and scroll inside themselves, so the dialog stays one screen. -->
                        <webui-flex gap="2" align="end" wrap-at="900">
                            <webui-input-text label="Campaign Name (required)" name="name" placeholder="Only shown here, to tell your campaigns apart" maxlength="100" style="flex:2 1 16em;"></webui-input-text>
                            <label style="flex:2 1 16em;">When to send <select name="campaignType"><option value="draft" selected>Draft: don't send</option><option value="immediate">Immediate: once, to every confirmed subscriber</option><option value="delayed">Delayed: to each subscriber, after they confirm</option></select></label>
                            <webui-input-text label="Delay in minutes (Delayed only)" name="sendOffsetMinutes" type="number" min="0" max="525600" value="0" style="flex:1 1 10em;"></webui-input-text>
                        </webui-flex>
                        <webui-input-text label="Email Subject (required)" name="subject" maxlength="200" data-trigger="page-news-draft-new.subject"></webui-input-text>
                        <webui-side-by-side style="align-items:start;padding:0;margin:var(--padding) 0;">
                            <webui-flex column gap="2">
                                <webui-input-message label="Email Body (HTML)" name="bodyHtml" maxlength="200000" height="36vh" data-trigger="page-news-draft-new.bodyHtml"></webui-input-message>
                                <webui-input-message label="Email Body (plain text)" name="bodyText" placeholder="Shown by mail apps that don't display HTML. Leave empty to make it from the HTML" maxlength="200000" height="16vh" data-trigger="page-news-draft-new.bodyText"></webui-input-message>
                            </webui-flex>
                            <webui-email-preview api="post|/user/newsletter/campaign/preview" data-api="filter-newsletter-campaigns" data-subscribe="page-news-draft-new" height="50vh"></webui-email-preview>
                        </webui-side-by-side>
                        <webui-quote theme="info">
                            Write only your own content. My Fidelity adds a header with the newsletter's name and your company, and a footer with why the subscriber is getting it, an unsubscribe link, and your company's postal address. The preview shows the whole email, and **Show Text** switches to the plain text version.
                        </webui-quote>
                        <webui-quote theme="info">
                            Immediate campaigns are queued within a few minutes and can't be changed afterward. Delayed campaigns go to each subscriber the given number of minutes after they confirm, for example 0 for a welcome email or 43200 for 30 days. A new delayed campaign isn't sent to subscribers whose send time had already passed more than an hour before you created it.
                        </webui-quote>
                        <webui-quote theme="warning">
                            Campaign emails are sent through your own email account, which you will connect in My Fidelity. Until then they wait in the queue.
                        </webui-quote>
                    </template>
                </webui-dialog-action>
                <webui-report label="Campaigns" api="/user/newsletter/campaigns" filters="filter-newsletter-campaigns" required-filters="newsletterId" sort-column="updated" sort-order="desc" bordered theme="info" data-subscribe="filter-newsletter-campaigns:loadData|refresh-news-campaigns:loadData" append-columns=":Actions:" sortable="name;subject;type;queued;sent;updated">
                <template slot="column" name="actions">
                    <webui-button theme="info" start-icon="pencil|shade:tri" title="Edit {TEMPLATE_NAME}" data-trigger="page-news-campaign-{_ROWID}-update|page-news-draft-{_ROWID}" data-value="1"></webui-button>
                    <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-trigger="page-news-campaign-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Edit {TEMPLATE_NAME}" confirm="Save Campaign" api="patch|/user/newsletter/campaign" data-subscribe="page-news-campaign-{_ROWID}-update" data-success="refresh-news-campaigns">
                        <template>
                            <input type="hidden" name="campaignId" value="{TEMPLATE_ID}" />
                            <webui-flex gap="2" align="end" wrap-at="900">
                                <webui-input-text label="Campaign Name (required)" name="name" maxlength="100" data-subscribe="page-tr-{_ROWID}.name" style="flex:2 1 16em;"></webui-input-text>
                                <label style="flex:2 1 16em;">When to send <select name="campaignType" data-subscribe="page-tr-{_ROWID}.campaign_type:value"><option value="draft">Draft: don't send</option><option value="immediate">Immediate: once, to every confirmed subscriber</option><option value="delayed">Delayed: to each subscriber, after they confirm</option></select></label>
                                <webui-input-text label="Delay in minutes (Delayed only)" name="sendOffsetMinutes" type="number" min="0" max="525600" data-subscribe="page-tr-{_ROWID}.send_offset_minutes" style="flex:1 1 10em;"></webui-input-text>
                            </webui-flex>
                            <webui-input-text label="Email Subject (required)" name="subject" maxlength="200" data-subscribe="page-tr-{_ROWID}.subject" data-trigger="page-news-draft-{_ROWID}.subject"></webui-input-text>
                            <webui-side-by-side style="align-items:start;padding:0;margin:var(--padding) 0;">
                                <webui-flex column gap="2">
                                    <webui-input-message label="Email Body (HTML)" name="bodyHtml" maxlength="200000" height="36vh" data-subscribe="page-tr-{_ROWID}.body_html" data-trigger="page-news-draft-{_ROWID}.bodyHtml"></webui-input-message>
                                    <webui-input-message label="Email Body (plain text)" name="bodyText" placeholder="Leave empty to make it from the HTML" maxlength="200000" height="16vh" data-subscribe="page-tr-{_ROWID}.body_text" data-trigger="page-news-draft-{_ROWID}.bodyText"></webui-input-message>
                                </webui-flex>
                                <webui-email-preview api="post|/user/newsletter/campaign/preview" data-api="filter-newsletter-campaigns" data-subscribe="page-tr-{_ROWID}|page-news-draft-{_ROWID}" height="50vh"></webui-email-preview>
                            </webui-side-by-side>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete Campaign" api="delete|/user/newsletter/campaign" data-subscribe="page-news-campaign-{_ROWID}-delete" data-success="refresh-news-campaigns">
                        <template>
                            <input type="hidden" name="campaignId" value="{TEMPLATE_ID}" />
                            <webui-quote theme="danger">
                                This deletes {TEMPLATE_NAME} and its queued emails. Emails already sent are not recalled.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
                </webui-report>
            </webui-content>
            <webui-button align="left" slot="tabs">Subscribers</webui-button>
            <webui-content slot="content" theme="default">
                <webui-page-segment>
                    The people signed up to a newsletter. **Pending** subscribers haven't confirmed their email yet, and are removed after 7 days if they don't. **Confirmed** subscribers receive your campaigns. **Unsubscribed** ones used the link in an email and receive nothing more.
                </webui-page-segment>
                <webui-page-segment>
                    <webui-dropdown label="Newsletter" data-subscribe="session-newsletter-id|filter-newsletter.domainId:loadData|refresh-newsletters:loadData" data-trigger="session-newsletter-id|filter-newsletter-campaigns.newsletterId|filter-newsletter-subscribers.newsletterId" data-api="filter-newsletter" api="user/newsletters/options" data-fields="domainId"></webui-dropdown>
                </webui-page-segment>
                <webui-quote theme="info">
                    Email addresses are partly hidden. Stoic Dreams keeps subscribers' personal data private.
                </webui-quote>
                <webui-report label="Subscribers" api="/user/newsletter/subscribers" filters="filter-newsletter-subscribers" required-filters="newsletterId" sort-column="created" sort-order="desc" bordered theme="info" data-subscribe="filter-newsletter-subscribers:loadData|refresh-newsletters:loadData" sortable="email;status;created;confirmed">
                </webui-report>
            </webui-content>
            <webui-button align="left" slot="tabs">Analytics</webui-button>
            <webui-content slot="content" theme="default">
                <webui-page-segment>
                    How each newsletter on this domain is growing. **New (30 days)** counts confirmed signups in the last 30 days. The email columns count campaign emails waiting in the queue, sent, and failed.
                </webui-page-segment>
                <webui-report label="Newsletter Analytics" api="/user/newsletters/analytics" filters="filter-newsletter" required-filters="companyId;domainId" sort-column="name" bordered theme="info" data-subscribe="filter-newsletter:loadData|refresh-newsletters:loadData|refresh-news-campaigns:loadData" sortable="name;confirmed;pending;unsubscribed;recent;queued;sent;failed">
                </webui-report>
                <webui-page-segment>
                    **Delivery Problems** lists every failed attempt to send a newsletter's emails, newest first, with the mail server's reason. **Retrying** shows whether it will be sent again: temporary problems are retried after 5 minutes, 15 minutes, 1 hour, and 4 hours. A refused address isn't sent to again, and a refused sign-in shows on the [Sending Addresses](/senders) page.
                </webui-page-segment>
                <webui-page-segment>
                    <webui-dropdown label="Newsletter" data-subscribe="session-newsletter-id|filter-newsletter.domainId:loadData|refresh-newsletters:loadData" data-trigger="session-newsletter-id|filter-newsletter-campaigns.newsletterId|filter-newsletter-subscribers.newsletterId" data-api="filter-newsletter" api="user/newsletters/options" data-fields="domainId"></webui-dropdown>
                </webui-page-segment>
                <webui-report label="Delivery Problems" api="/user/newsletter/failures" filters="filter-newsletter-campaigns" required-filters="newsletterId" sort-column="happened" sort-order="desc" bordered theme="info" data-subscribe="filter-newsletter-campaigns:loadData|refresh-news-campaigns:loadData" sortable="happened;campaign;attempt;problem">
                </webui-report>
            </webui-content>
        </webui-tabs>
    </template>
    <template slot="invalid">
        <webui-quote theme="warning">
            You must be signed in to use this service.
        </webui-quote>
    </template>
</webui-restrict-to-role>
