<webui-data data-page-title="Company Management" data-page-subtitle="" data-page-description="Set up the companies that own your domains, apps, and services, and add the postal address newsletter emails must show. Sign in to manage them."></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            Companies are the top level of everything in My Fidelity. Each company holds its own domains, apps, and the services that use them, so separate businesses, projects, or clients stay apart. Start here: add a company, give it a postal address, then add its websites on the Domains page.
        </webui-page-segment>
        <webui-page-help heading="Companies Guide" storage-key="myfi-companies-help">
            <webui-tabs theme="info">
                <webui-button slot="tabs">Getting Started</webui-button>
                <webui-content slot="content" nodetach>

1. **Add a company** with the button below. Use the name your customers know you by, because it appears in your newsletter emails.
2. **Set its postal address** with the address button on its row.
3. **Add its domains** on the [Domains](/domains) page, and its installed programs on the [Apps](/apps) page.

Your account can own up to 5 companies.

                </webui-content>
                <webui-button slot="tabs">Postal Address</webui-button>
                <webui-content slot="content" nodetach>

Laws such as the US CAN-SPAM Act require every newsletter email to show the sender's physical postal address. My Fidelity adds your company's address to the footer of its newsletter emails, so you never have to remember it.

- Use a street address, a post office box, or a private mailbox registered with a mail service.
- Put each part of the address on its own line.
- Campaigns don't send until the company has an address. Signups still work without one.

                </webui-content>
                <webui-button slot="tabs">Renaming and Deleting</webui-button>
                <webui-content slot="content" nodetach>

Renaming a company changes the name shown everywhere, including in future newsletter emails.

Deleting a company deletes everything in it: its domains, apps, newsletters, subscribers, and feedback. It can't be undone.

                </webui-content>
            </webui-tabs>
        </webui-page-help>
        <webui-page-segment>
            <webui-flex align="center" justify="right">
                <webui-button data-trigger="page-company-create" data-value="1">Add Company</webui-button>
            </webui-flex>
            <webui-dialog-action title="Add Company" confirm="Add Company" api="post|/user/company/create" data-subscribe="page-company-create" header-message="x-debug|x-message" data-success="refresh-companies">
                <template>
                    <webui-page-segment>
                        Provide the name of the company to add.
                    </webui-page-segment>
                    <webui-input-text label="Company Name" name="name" maxlength="100"></webui-input-text>
                    <webui-quote theme="info">
                        Note: Companies are used as a top-level grouping. Within a company you can have 1 or more domains. Domains can only belong to 1 company. Most My Fidelity resources/services are grouped under domains - such as Feedback and Newsletters. But some resources/services are grouped directly under a company - such as Short URL.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-report label="My Companies" api="/user/companies" sort-column="name" bordered theme="info" data-subscribe="refresh-companies:loadData" append-columns=":Action:" sortable="name;created;updated">
        <template slot="column" name="action">
            <webui-button theme="info" start-icon="pencil|shade:tri" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-company-{_ROWID}-update"></webui-button>
            <webui-button theme="info" start-icon="map" title="Postal Address for {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-company-{_ROWID}-address"></webui-button>
            <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-company-{_ROWID}-delete"></webui-button>
            <webui-dialog-action title="Postal Address for {TEMPLATE_NAME}" confirm="Save Address" api="patch|/user/company/address" data-subscribe="page-company-{_ROWID}-address" data-success="refresh-companies">
                <template>
                    <webui-page-segment>
                        This address is shown at the bottom of every newsletter email from {TEMPLATE_NAME}, as the law requires. Use a street address, a post office box, or a registered private mailbox, with each part on its own line.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" value="{TEMPLATE_ID}" />
                    <webui-input-message label="Postal Address" name="address" maxlength="500" placeholder="123 Main Street&#10;Springfield, IL 62701&#10;United States" data-subscribe="page-tr-{_ROWID}.address"></webui-input-message>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Update Name of {TEMPLATE_NAME}" confirm="Update Name" api="patch|/user/company" data-subscribe="page-company-{_ROWID}-update" data-success="refresh-companies">
                <template>
                    <webui-page-segment>
                        Provide the new name for company {TEMPLATE_NAME}.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" value="{TEMPLATE_ID}" />
                    <webui-input-text label="Company Name" name="name" maxlength="100" value="{TEMPLATE_NAME}"></webui-input-text>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/company" data-subscribe="page-company-{_ROWID}-delete" data-success="refresh-companies">
                <template>
                    <webui-page-segment>
                        Please confirm you would like to delete {TEMPLATE_NAME}.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" value="{TEMPLATE_ID}" />
                    <webui-quote theme="danger">
                        Note: This will delete the company and all data directly associated with this company, including domains, feedback, etc.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </template>
        </webui-report>
    </template>
    <template slot="invalid">
        <webui-quote theme="warning">
            You must be signed in to use this service.
        </webui-quote>
    </template>
</webui-restrict-to-role>
