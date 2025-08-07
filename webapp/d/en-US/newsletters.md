<webui-data data-page-title="Newsletter Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment elevation="10">
            <webui-flex gap="3" class="container" wrap-at="600">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-newsletter.companyId" api="user/companies/options"></webui-dropdown>
                <webui-dropdown label="Domain" data-subscribe="session-domain-id|filter-newsletter.domainId:loadData" data-trigger="session-domain-id|filter-newsletter.domainId" data-api="filter-newsletter" api="user/domains/options"></webui-dropdown>
                <webui-flex align="center" justify="right">
                    <webui-button data-trigger="page-newsletter-create" data-value="1">Add Newsletter</webui-button>
                </webui-flex>
            </webui-flex>
            <webui-dialog-action title="Add Newsletter" confirm="Add Newsletter" api="post|/user/newsletter/create" data-subscribe="page-newsletter-create" header-message="x-debug|x-message" data-success="refresh-newsletters">
                <template>
                    <webui-page-segment>
                        Create a newsletter for this domain.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                    <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                    <webui-input-text label="Newsletter Name" name="name" placeholder="Your Newsletter Name" maxlength="100"></webui-input-text>
                    <webui-input-message label="Description" name="description" placeholder="Describe this newsletter to your customers" maxlength="50000"></webui-input-message>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-tabs theme="secondary" index="1" transition-timing="200" data-subscribe="session-newsletters-tab-index:setTab">
            <webui-button align="left" slot="tabs">Analytics</webui-button>
            <webui-content slot="content" theme="default">
            </webui-content>
            <webui-button align="left" slot="tabs">Campaigns</webui-button>
            <webui-content slot="content" theme="default">
                <webui-page-segment>
                    <webui-dropdown label="Newsletter" data-subscribe="session-newsletter-id" data-trigger="session-newsletter-id|filter-newsletter.newsletterId" api="user/companies/options"></webui-dropdown>
                    <webui-flex align="center" justify="right">
                        <webui-button data-trigger="page-news-campaign-create" data-value="1">Add Campaign</webui-button>
                    </webui-flex>
                </webui-page-segment>
                <webui-dialog-action title="Add Newsletter Campaign" confirm="Add Campaign" api="post|/user/newsletter/campaign/create" data-subscribe="page-news-campaign-create" header-message="x-debug|x-message" data-success="refresh-newsletters">
                    <template>
                        <webui-page-segment>
                            Create an email (campaign) that will be sent to users subscribed to this newsletter.
                            - **Draft**: Campaign is disabled from sending.
                            - **Immediate**: Campaign is immediately scheduled for send to subscribers.
                            - **Delayed**: Campaign is sent to subscribers based on a delay relative to when they signed up. Use 0 to reflect sending immediately after signup; 20 Minutes to send 20 minutes after signup; 30 Days to send 30 days after signup; etc.
                        </webui-page-segment>
                        <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                        <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                        <input type="hidden" name="newsletterId" data-subscribe="session-newsletter-id" />
                        <webui-input-text label="Campaign Name" name="name" placeholder="Your Campaign Name" maxlength="100"></webui-input-text>
                        <webui-input-message label="Description" name="description" placeholder="Describe this newsletter to your customers" maxlength="50000"></webui-input-message>
                        <webui-quote theme="info">
                            Note: Delayed sends are based on time blocks. For performance and compliance reasons, we limit how many emails we send every minute. This means that actual delays may be longer than configured for. When sending delayed emails, we calculate a buffer from the delay amount plus 1 hour. This means delayed campaigns are not retroactive beyond this hour - meaning if you create a new campaign with a delayed value of 0, the campaign would only be sent to subscribers whom have subscribed within the past hour and future subscribers.
                        </webui-quote>
                    </template>
                </webui-dialog-action>
                <webui-report label="My Newsletter Campaigns" api="/user/newsletters/campaigns" filters="filter-newsletter" required-filters="companyId;domainId;newsletterId" sort-column="name" bordered theme="info" data-subscribe="session-company-id:loadData|session-domain-id:loadData|session-newsletter-id:loadData|refresh-newsletters:loadData" append-columns=":Actions:" sortable="name;created;updated">
                <template slot="column" name="actions">
                    <webui-button theme="info" start-icon="pencil|has-shadow:true|shade:tri" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-news-campaign-{_ROWID}-update"></webui-button>
                    <webui-button theme="danger" start-icon="circle|has-shadow:true|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-news-campaign-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Update Campaign {TEMPLATE_NAME}" confirm="Update Campaign" api="patch|/user/newsletter/campaign" data-subscribe="page-news-campaign-{_ROWID}-update" data-success="refresh-newsletters">
                        <template>
                            <webui-page-segment>
                                Update details for newsletter campaign {TEMPLATE_NAME}.
                            </webui-page-segment>
                            <input type="hidden" name="campaignId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="newsletterId" data-subscribe="session-newsletter-id" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                            <webui-input-text label="Campaign Name" name="name" maxlength="100" value="{TEMPLATE_NAME}"></webui-input-text>
                            <webui-input-text label="Email Subject" name="subject" maxlength="100" value="{TEMPLATE_SUBJECT}"></webui-input-text>
                            <webui-input-message label="Body HTML" name="bodyHtml" maxlength="50000" value="{TEMPLATE_BODY_HTML}"></webui-input-message>
                            <webui-input-message label="Body Text" name="bodyText" maxlength="50000" value="{TEMPLATE_BODY_TEXT}"></webui-input-message>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/newsletter/campaign" data-subscribe="page-news-campaign-{_ROWID}-delete" data-success="refresh-newsletters">
                        <template>
                            <webui-page-segment>
                                Please confirm you would like to delete {TEMPLATE_NAME}.
                            </webui-page-segment>
                            <input type="hidden" name="campaignId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="newsletterId" data-subscribe="session-newsletter-id" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                            <webui-quote theme="danger">
                                Note: This will delete the newsletter and all data directly associated with this newsletter.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
                </webui-report>
            </webui-content>
            <webui-button align="left" slot="tabs">Newsletters</webui-button>
            <webui-content slot="content" theme="default">
                <webui-report label="My Newsletters" api="/user/newsletters" filters="filter-newsletter" required-filters="companyId;domainId" sort-column="name" bordered theme="info" data-subscribe="session-company-id:loadData|session-domain-id:loadData|refresh-newsletters:loadData" append-columns=":Actions:" sortable="name;created;updated">
                <template slot="column" name="actions">
                    <webui-button theme="info" start-icon="pencil|has-shadow:true|shade:tri" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-newsletter-{_ROWID}-update"></webui-button>
                    <webui-button theme="danger" start-icon="circle|has-shadow:true|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-newsletter-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Update Newsletter {TEMPLATE_NAME}" confirm="Update Newsletter" api="patch|/user/newsletter" data-subscribe="page-newsletter-{_ROWID}-update" data-success="refresh-newsletters">
                        <template>
                            <webui-page-segment>
                                Update details for newsletter {TEMPLATE_NAME}.
                            </webui-page-segment>
                            <input type="hidden" name="newsletterId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <input type="hidden" name="domainId" data-subscribe="session-domain-id" />
                            <webui-input-text label="Newsletter Name" name="name" maxlength="100" value="{TEMPLATE_NAME}"></webui-input-text>
                            <webui-input-message label="Description" name="description" maxlength="50000" value="{TEMPLATE_DESCRIPTION}"></webui-input-message>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/newsletter" data-subscribe="page-newsletter-{_ROWID}-delete" data-success="refresh-newsletters">
                        <template>
                            <webui-page-segment>
                                Please confirm you would like to delete {TEMPLATE_NAME}.
                            </webui-page-segment>
                            <input type="hidden" name="domainId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <webui-quote theme="danger">
                                Note: This will delete the newsletter and all data directly associated with this newsletter.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
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
