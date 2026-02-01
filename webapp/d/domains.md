<webui-data data-page-title="Domain Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment elevation="10">
            <webui-flex gap="3">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-domains.companyId" api="user/companies/options"></webui-dropdown>
                <webui-flex align="center" justify="right">
                    <webui-button data-trigger="page-domain-create" data-value="1">Add Domain</webui-button>
                </webui-flex>
            </webui-flex>
            <webui-dialog-action title="Add Domain" confirm="Add Domain" api="post|/user/domain/create" data-subscribe="page-domain-create" header-message="x-debug|x-message" data-success="refresh-domains">
                <template>
                    <webui-page-segment>
                        Provide the name of the domain to add.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                    <webui-input-text label="Domain Name" name="name" placeholder="Your Domain Name" maxlength="100"></webui-input-text>
                    <webui-input-text label="Domain" name="dom" placeholder="www.yoursite.com" maxlength="500"></webui-input-text>
                    <webui-quote theme="info">
                        Note: Domains are used to group domain specific services. Domains can only belong to 1 company. Most My Fidelity resources/services are grouped under domains - such as Feedback and Newsletters. But some resources/services are grouped directly under a company - such as Short URL.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-tabs theme="secondary" index="1" transition-timing="200" data-subscribe="session-mydomains-tab-index:setTab">
            <webui-button align="left" slot="tabs">My Domains</webui-button>
            <webui-content slot="content" theme="default">
                <webui-report label="My Domains" api="/user/domains" filters="filter-domains" required-filters="companyId" sort-column="name" bordered theme="info" data-subscribe="session-company-id:loadData|refresh-domains:loadData" append-columns=":Actions:" sortable="name;created;updated">
                <template slot="column" name="actions">
                    <webui-button theme="info" start-icon="pencil|shade:tri" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-domain-{_ROWID}-update"></webui-button>
                    <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-domain-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Update Name of {TEMPLATE_DOMAIN}" confirm="Update Name" api="patch|/user/domain" data-subscribe="page-domain-{_ROWID}-update" data-success="refresh-domains">
                        <template>
                            <webui-page-segment>
                                Provide the new name for domain {TEMPLATE_DOMAIN}.
                            </webui-page-segment>
                            <input type="hidden" name="domainId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <webui-input-text label="Domain Name" name="name" maxlength="100" value="{TEMPLATE_NAME}"></webui-input-text>
                        </template>
                    </webui-dialog-action>
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/domain" data-subscribe="page-domain-{_ROWID}-delete" data-success="refresh-domains">
                        <template>
                            <webui-page-segment>
                                Please confirm you would like to delete {TEMPLATE_NAME}.
                            </webui-page-segment>
                            <input type="hidden" name="domainId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <webui-quote theme="danger">
                                Note: This will delete the domain and all data directly associated with this domain, feedback, etc.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
                </webui-report>
            </webui-content>
            <webui-button align="left" slot="tabs">Pending Domains</webui-button>
            <webui-content slot="content" theme="default">
                <webui-quote theme="info">
                    Domains must be verified before they can be used for services. Click Instructions to view instructions on how to verify your domain.
                </webui-quote>
                <webui-report label="My Pending Domains" api="/user/domains/pending" filters="filter-domains" required-filters="companyId" sort-column="name" bordered theme="info" data-subscribe="session-company-id:loadData|refresh-domains:loadData" append-columns=":Actions:" sortable="name;domain;status;created;updated">
                <template slot="column" name="actions">
                    <webui-button theme="info" start-icon="bell" title="Instructions" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-domain-{_ROWID}-instruct"></webui-button>
                    <webui-dialog-action title="Instructions for {TEMPLATE_NAME}" confirm="Close" data-subscribe="page-domain-{_ROWID}-instruct">
                        <template>
                            <webui-page-segment>
                                To confirm your domain {TEMPLATE_NAME} you will need to add a TXT record with this value `myfi:{TEMPLATE_KEY}` to your domain {TEMPLATE_DOMAIN}.
                            </webui-page-segment>
                            <webui-code label="TXT Record Value">myfi:{TEMPLATE_KEY}</webui-code>
                            <webui-quote theme="info">
                                Note: The TXT record must be set for the exact domain name. Do not set the record for @.domain.com when your domain is www.domain.com.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                    <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-domain-{_ROWID}-delete"></webui-button>
                    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/domain/pending" data-subscribe="page-domain-{_ROWID}-delete" data-success="refresh-domains">
                        <template>
                            <webui-page-segment>
                                Please confirm you would like to delete {TEMPLATE_NAME}.
                            </webui-page-segment>
                            <input type="hidden" name="domainId" value="{TEMPLATE_ID}" />
                            <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                            <webui-quote theme="danger">
                                Note: This will delete the pending domain {TEMPLATE_DOMAIN}.
                            </webui-quote>
                        </template>
                    </webui-dialog-action>
                </template>
                </webui-report>
            </webui-content>
        </webui-tabs>
        <webui-quote theme="info">
            We treat sub-domains and root domains separately. For example, we have 2 websites - webui.stoicdreams.com and www.stoicdreams.com. This required us to setup 2 separate domains. We cannot just use stoicdreams.com to group the 2 websites together.
        </webui-quote>
    </template>
    <template slot="invalid">
        <webui-quote theme="warning">
            You must be signed in to use this service.
        </webui-quote>
    </template>
</webui-restrict-to-role>
