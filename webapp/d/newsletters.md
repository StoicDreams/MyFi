<webui-data data-page-title="Newsletter Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
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
                        Create a newsletter for this domain. Visitors see its name and description above the signup form, unless your site provides its own text.
                    </webui-page-segment>
                    <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                    <webui-input-text label="Newsletter Name" name="name" placeholder="Your Newsletter Name" maxlength="100"></webui-input-text>
                    <webui-input-message label="Description" name="description" placeholder="Tell visitors what they will receive and how often" maxlength="2000"></webui-input-message>
                    <webui-quote theme="info">
                        Each newsletter is its own subscription. A new newsletter accepts signups once its subscription is active.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-tabs theme="secondary" index="0" transition-timing="200" data-subscribe="session-newsletters-tab-index:setTab">
            <webui-button align="left" slot="tabs">Newsletters</webui-button>
            <webui-content slot="content" theme="default">
                <webui-report label="Newsletters" api="/user/newsletters" filters="filter-newsletter" required-filters="companyId;domainId" sort-column="name" bordered theme="info" data-subscribe="filter-newsletter:loadData|refresh-newsletters:loadData" append-columns=":Actions:" sortable="name;status;subscribers;pending;created">
                <template slot="column" name="actions">
                    <webui-button theme="tertiary" start-icon="code" title="Signup Form Code" data-trigger="page-newsletter-{_ROWID}-code"></webui-button>
                    <webui-button theme="info" start-icon="pencil|shade:tri" title="Edit {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-update"></webui-button>
                    <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-trigger="page-newsletter-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Signup Form for {TEMPLATE_NAME}" confirm="Close" data-subscribe="page-newsletter-{_ROWID}-code">
                        <template>
                            <webui-page-segment>
                                Add this to any page of the newsletter's domain to show its signup form. It only works on that domain.
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
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete Newsletter" api="delete|/user/newsletter" data-subscribe="page-newsletter-{_ROWID}-delete" data-success="refresh-newsletters">
                        <template>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <webui-quote theme="danger">
                                This deletes {TEMPLATE_NAME} with all of its campaigns and subscribers. It can't be undone, and its signup forms stop working.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
                </webui-report>
            </webui-content>
            <webui-button align="left" slot="tabs">Campaigns</webui-button>
            <webui-content slot="content" theme="default">
                <webui-page-segment>
                    <webui-flex gap="3" wrap-at="600">
                        <webui-dropdown label="Newsletter" data-subscribe="session-newsletter-id|filter-newsletter.domainId:loadData|refresh-newsletters:loadData" data-trigger="session-newsletter-id|filter-newsletter-campaigns.newsletterId|filter-newsletter-subscribers.newsletterId" data-api="filter-newsletter" api="user/newsletters/options" data-fields="domainId"></webui-dropdown>
                        <webui-flex align="center" justify="right">
                            <webui-button data-trigger="page-news-campaign-create" data-value="1">Add Campaign</webui-button>
                        </webui-flex>
                    </webui-flex>
                </webui-page-segment>
                <webui-dialog-action title="Add Campaign" confirm="Add Campaign" api="post|/user/newsletter/campaign/create" data-subscribe="page-news-campaign-create" data-success="refresh-news-campaigns">
                    <template>
                        <input type="hidden" name="newsletterId" data-subscribe="session-newsletter-id" />
                        <webui-input-text label="Campaign Name" name="name" placeholder="Only shown here" maxlength="100"></webui-input-text>
                        <webui-input-text label="Email Subject" name="subject" maxlength="200"></webui-input-text>
                        <webui-input-message label="Email Body (HTML)" name="bodyHtml" maxlength="200000"></webui-input-message>
                        <webui-input-message label="Email Body (plain text)" name="bodyText" placeholder="Shown by mail apps that don't display HTML" maxlength="200000"></webui-input-message>
                        <label>When to send <select name="campaignType"><option value="draft" selected>Draft: don't send</option><option value="immediate">Immediate: once, to every confirmed subscriber</option><option value="delayed">Delayed: to each subscriber, after they confirm</option></select></label>
                        <webui-input-text label="Delay in minutes (Delayed only)" name="sendOffsetMinutes" type="number" min="0" max="525600" value="0"></webui-input-text>
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
                    <webui-button theme="info" start-icon="pencil|shade:tri" title="Edit {TEMPLATE_NAME}" data-trigger="page-news-campaign-{_ROWID}-update"></webui-button>
                    <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-trigger="page-news-campaign-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Edit {TEMPLATE_NAME}" confirm="Save Campaign" api="patch|/user/newsletter/campaign" data-subscribe="page-news-campaign-{_ROWID}-update" data-success="refresh-news-campaigns">
                        <template>
                            <input type="hidden" name="campaignId" value="{TEMPLATE_ID}" />
                            <webui-input-text label="Campaign Name" name="name" maxlength="100" data-subscribe="page-tr-{_ROWID}.name"></webui-input-text>
                            <webui-input-text label="Email Subject" name="subject" maxlength="200" data-subscribe="page-tr-{_ROWID}.subject"></webui-input-text>
                            <webui-input-message label="Email Body (HTML)" name="bodyHtml" maxlength="200000" data-subscribe="page-tr-{_ROWID}.body_html"></webui-input-message>
                            <webui-input-message label="Email Body (plain text)" name="bodyText" maxlength="200000" data-subscribe="page-tr-{_ROWID}.body_text"></webui-input-message>
                            <label>When to send <select name="campaignType" data-subscribe="page-tr-{_ROWID}.campaign_type:value"><option value="draft">Draft: don't send</option><option value="immediate">Immediate: once, to every confirmed subscriber</option><option value="delayed">Delayed: to each subscriber, after they confirm</option></select></label>
                            <webui-input-text label="Delay in minutes (Delayed only)" name="sendOffsetMinutes" type="number" min="0" max="525600" data-subscribe="page-tr-{_ROWID}.send_offset_minutes"></webui-input-text>
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
                <webui-report label="Newsletter Analytics" api="/user/newsletters/analytics" filters="filter-newsletter" required-filters="companyId;domainId" sort-column="name" bordered theme="info" data-subscribe="filter-newsletter:loadData|refresh-newsletters:loadData|refresh-news-campaigns:loadData" sortable="name;confirmed;pending;unsubscribed;recent;queued;sent;failed">
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
